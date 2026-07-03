const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
