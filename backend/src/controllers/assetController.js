const Asset = require('../models/Asset');

exports.createAsset = async (req, res) => {
    try {
        const asset = await Asset.create(req.body);
        res.status(201).json({ success: true, data: asset });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getAssets = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Employee') {
            if (!req.query.assignedTo) {
                return res.status(400).json({ success: false, message: 'assignedTo query required' });
            }
            query.assignedTo = req.query.assignedTo;
        }

        const assets = await Asset.find(query).populate('assignedTo', 'name');
        res.status(200).json({ success: true, count: assets.length, data: assets });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
