/**
 * @file models/cost.js
 * @description Mongoose model for the costs collection.
 */

const mongoose = require('mongoose');

// מגדיר סכמה להוצאות ע"י הקונסטרקטור של מונגוס סכמה
const costSchema = new mongoose.Schema({
    userid: { type: Number, required: true }, // Refers to the user's id
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['food', 'health', 'housing', 'sport', 'education'],
        required: true,
    },
    sum: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }, // אם לא מוזן תאריך - יוזן התאריך הנוכחי
});

module.exports = mongoose.model('Cost', costSchema); // מייצא את הסכמה תחת השם Cost
