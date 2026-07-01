const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
