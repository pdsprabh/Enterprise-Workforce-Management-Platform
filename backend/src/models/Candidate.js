const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);
