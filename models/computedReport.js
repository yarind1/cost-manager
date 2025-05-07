const mongoose = require('mongoose');

// .מגדיר סכמה לדוחות שמורים ע"י הקונסטרקטור של מונגוס סכמה
const computedReportSchema = new mongoose.Schema({
    userid: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    costs: { type: Array, required: true }, // Precomputed array of grouped costs
    computedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ComputedReport', computedReportSchema);
