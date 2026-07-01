const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Performance', PerformanceSchema);
