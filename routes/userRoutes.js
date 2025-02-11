/**
 * @file routes/userRoutes.js
 * @description Defines the endpoint for retrieving user details.
 */

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

/**
 * @route GET /api/users/:id
 * @description Retrieves user details along with the total cost.
 * @param {number} id - User identifier in the URL.
 * @returns {Object} JSON object containing first_name, last_name, id, and total cost.
 */
router.get('/users/:id', async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const user = await User.findOne({ id: userId }).lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Aggregate total sum of costs for the user
        const costs = await Cost.aggregate([
            { $match: { userid: userId } },
            { $group: { _id: null, total: { $sum: "$sum" } } }, // _id=null - all the documents are combined into a single group
        ]);
        const total = costs.length > 0 ? costs[0].total : 0;

        const response = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            total,
        };

        return res.status(200).json(response);
    } catch (err) {
        console.error("Error fetching user details:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
