const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Organization', OrganizationSchema);
