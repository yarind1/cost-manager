// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');
const ComputedReport = require('../models/computedReport');
const User = require('../models/user');


/**
 * GET /api/report
 * Retrieves cost items for a user for a specific month and year.
 * Uses caching differently for past and current months.
 */
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;
        if (!id || !year || !month) {
            return res.status(400).json({ error: 'Missing required query parameters.' });
        }

        const userId = Number(id);
        const targetYear = Number(year);
        const targetMonth = Number(month);

        // **User Validation:**
        // Check if a user with the given userId exists in the database.
        const user = await User.findOne({ id: userId });
        if (!user) {
            // If no such user is found, return a 404 error.
            return res.status(404).json({ error: 'User not found.' });
        }
        // Determine the current date info
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed

        // Compute the date range for the target month
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 1);
        const costs = await Cost.find({
            userid: userId,
            createdAt: { $gte: startDate, $lt: endDate },
        }).lean();

        // Define an array of allowed cost categories.
        const categories = ['food', 'health', 'housing', 'sport', 'education'];

        // Initialize an empty object to store cost items grouped by category.
        let groupedCosts = {};

        // For each category in the categories array, create a key in groupedCosts and set its value to an empty array.
        // This prepares a structure like { food: [], health: [], housing: [], sport: [], education: [] }.
        categories.forEach((cat) => (groupedCosts[cat] = []));

        // Loop over each cost item in the costs array.
        costs.forEach((item) => {
            // Create a Date object from the item's createdAt property and extract the day of the month.
            const day = new Date(item.createdAt).getDate();

            // Add the current cost item to the corresponding category array in groupedCosts.
            // Each cost item is stored as an object with its sum, description, and the extracted day.
            groupedCosts[item.category].push({
                sum: item.sum,
                description: item.description,
                day,
            });
        });

        // Convert the groupedCosts object into an array where each element is an object.
        // Each object in the array has a key that is a category name, and the value is the array of cost items for that category.
        const computedCosts = categories.map((cat) => ({ [cat]: groupedCosts[cat] }));

        // Determine if the target date is in the future
        if (targetYear > currentYear || (targetYear === currentYear && targetMonth > currentMonth)) {
            return res.status(400).json({ error: 'Reports for future months are not available.' });
        }

        // For current month, update the cached report if it exists; for past months, only cache once.
        if (targetYear === currentYear && targetMonth === currentMonth) {
            let report = await ComputedReport.findOne({ userid: userId, year: targetYear, month: targetMonth });
            if (report) {
                // Update the report with new computed data
                report.costs = computedCosts;
                report.computedAt = new Date();
                await report.save();
                console.log('Updated cached report for current month.');
                return res.status(200).json(report);
            } else {
                // Create a new report and cache it
                report = new ComputedReport({
                    userid: userId,
                    year: targetYear,
                    month: targetMonth,
                    costs: computedCosts,
                });
                await report.save();
                console.log('Computed and cached new report for current month.');
                return res.status(200).json(report);
            }
        } else {
            // For past months: if a cached report exists, return it; otherwise, compute and cache it.
            let report = await ComputedReport.findOne({ userid: userId, year: targetYear, month: targetMonth });
            if (report) {
                console.log('Returning cached report for past month.');
                return res.status(200).json(report);
            }
            report = new ComputedReport({
                userid: userId,
                year: targetYear,
                month: targetMonth,
                costs: computedCosts,
            });
            await report.save();
            console.log('Computed and cached new report for past month.');
            return res.status(200).json(report);
        }
    } catch (err) {
        console.error("Error fetching report:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
