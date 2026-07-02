const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
