const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
