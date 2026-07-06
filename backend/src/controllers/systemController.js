const SystemMetric = require('../models/SystemMetric');
const SystemAlert = require('../models/SystemAlert');

// @desc    Get system metrics
// @route   GET /api/system/metrics
// @access  Private (IT Admin, Super Admin)
exports.getMetrics = async (req, res) => {
    try {
        let metrics = await SystemMetric.findOne();
        if (!metrics) {
            metrics = await SystemMetric.create({});
        }
        res.status(200).json({ success: true, data: metrics });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update system metrics
// @route   PUT /api/system/metrics
// @access  Private (IT Admin, Super Admin)
exports.updateMetrics = async (req, res) => {
    try {
        let metrics = await SystemMetric.findOne();
        if (!metrics) {
            metrics = await SystemMetric.create(req.body);
        } else {
            metrics = await SystemMetric.findByIdAndUpdate(metrics._id, req.body, {
                new: true,
                runValidators: true
            });
        }
        res.status(200).json({ success: true, data: metrics });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get system alerts
// @route   GET /api/system/alerts
// @access  Private
exports.getAlerts = async (req, res) => {
    try {
        const alerts = await SystemAlert.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json({ success: true, data: alerts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a system alert
// @route   POST /api/system/alerts
// @access  Private (IT Admin, Super Admin)
exports.createAlert = async (req, res) => {
    try {
        const alert = await SystemAlert.create(req.body);
        res.status(201).json({ success: true, data: alert });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
