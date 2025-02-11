/**
 * @file server.js
 * @description Main entry point for the Cost Manager RESTful API.
 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import route modules
const costRoutes = require('./routes/costRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const aboutRoutes = require('./routes/aboutRoutes');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB Atlas

require('dotenv').config(); // Loads environment variables from .env into process.env
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mount the routes under /api
app.use('/api', costRoutes);
app.use('/api', reportRoutes);
app.use('/api', userRoutes);
app.use('/api', aboutRoutes);

// If this module is run directly, start the server
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export app for testing purposes
module.exports = app;
