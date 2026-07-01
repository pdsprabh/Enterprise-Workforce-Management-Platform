const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
