const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
