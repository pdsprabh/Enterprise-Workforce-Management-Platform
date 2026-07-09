const mongoose = require('mongoose');

const SystemMetricSchema = new mongoose.Schema({
    uptime: {
        type: String,
        default: '99.99%'
    },
    activeServers: {
        type: Number,
        default: 124
    },
    avgLatency: {
        type: String,
        default: '42ms'
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemMetric', SystemMetricSchema);
