/**
 * @file models/user.js
 * @description Mongoose model for the users collection.
 */

const mongoose = require('mongoose');
// מגדיר סכמה למשתמשים ע"י הקונסטרקטור של מונגוס סכמה
const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true }, // Unique user identifier
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    birthday: { type: Date },
    marital_status: { type: String },
});


module.exports = mongoose.model('User', userSchema); // מייצא את הסכמה תחת השם User
