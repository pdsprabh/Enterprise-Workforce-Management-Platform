const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Leave', LeaveSchema);
