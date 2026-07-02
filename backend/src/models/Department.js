const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
