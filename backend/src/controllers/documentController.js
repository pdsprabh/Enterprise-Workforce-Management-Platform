const Document = require('../models/Document');

exports.createDocument = async (req, res) => {
    try {
        const doc = await Document.create({
            ...req.body,
            uploadedBy: req.user.id
        });
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Employee') {
            if (!req.query.owner) {
                return res.status(400).json({ success: false, message: 'owner query required' });
            }
            // Employees can see their own docs + company wide policies (owner null)
            query = { $or: [{ owner: req.query.owner }, { owner: { $exists: false } }, { owner: null }] };
        }

        const docs = await Document.find(query).populate('owner', 'name');
        res.status(200).json({ success: true, count: docs.length, data: docs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
