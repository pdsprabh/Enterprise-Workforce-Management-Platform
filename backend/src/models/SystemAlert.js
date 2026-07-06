const mongoose = require('mongoose');

const SystemAlertSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Security', 'Performance', 'Global', 'System']
    },
    message: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        required: true,
        enum: ['Critical', 'Warning', 'Info']
    },
    ip: {
        type: String,
        default: 'N/A'
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemAlert', SystemAlertSchema);
