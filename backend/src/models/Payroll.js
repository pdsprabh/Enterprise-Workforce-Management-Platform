const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Payroll', PayrollSchema);
