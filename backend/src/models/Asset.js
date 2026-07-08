const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);
