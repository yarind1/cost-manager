/**
 * @file routes/costRoutes.js
 * @description Defines the endpoint for adding cost items.
 */

const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');

/**
 * @route POST /api/add
 * @description Adds a new cost item.
 * @param {string} description - Description of the cost.
 * @param {string} category - Category of the cost (food, health, housing, sport, education).
 * @param {number} userid - User identifier.
 * @param {number} sum - The cost sum.
 * @param {Date} [createdAt] - (Optional) Creation date/time.
 * @returns {Object} Newly created cost item in JSON.
 */
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum, createdAt } = req.body; // יוצר משתנים

        // Validate required fields.
        if (!description || !category || !userid || !sum) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Determine the date to use (provided or current date)
        const costDate = createdAt ? new Date(createdAt) : new Date();
        const now = new Date();

        // Check if costDate is in a past month (for example, if costDate's month and year are before now's)
        if (costDate.getFullYear() < now.getFullYear() ||
            (costDate.getFullYear() === now.getFullYear() && costDate.getMonth() < now.getMonth())) {
            return res.status(400).json({ error: 'Cannot add cost items for past months. Past month reports are immutable.' });
        }

        // Build costData object using costDate
        const costData = { description, category, userid, sum, createdAt: costDate };
        const newCost = new Cost(costData);
        await newCost.save();

        return res.status(201).json(newCost);
    } catch (err) {
        console.error("Error adding cost item:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
