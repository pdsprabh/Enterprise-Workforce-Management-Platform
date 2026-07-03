const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
