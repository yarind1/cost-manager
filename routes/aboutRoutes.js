/**
 * @file routes/aboutRoutes.js
 * @description Defines the endpoint for getting the team member information.
 */

const express = require('express');
const router = express.Router();

/**
 * @route GET /api/about
 * @description Returns a static list of team members (only first_name and last_name).
 * @returns {Array} Array of objects with team members’ first_name and last_name.
 */
router.get('/about', (req, res) => {
    // Return a static JSON array with team members' names.
    const teamMembers = [
        { first_name: 'Yarin', last_name: 'Doanis' },
        { first_name: 'Arthur', last_name: 'Anikin' }
    ];
    return res.status(200).json(teamMembers);
});

module.exports = router;
