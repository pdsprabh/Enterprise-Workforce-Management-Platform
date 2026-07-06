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
            const Employee = require('../models/Employee');
            const employee = await Employee.findOne({ user: req.user._id });
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee profile not found' });
            }
            query = { $or: [{ owner: employee._id }, { owner: { $exists: false } }, { owner: null }] };
        }

        const docs = await Document.find(query).populate('owner', 'name');
        res.status(200).json({ success: true, count: docs.length, data: docs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMyDocuments = async (req, res) => {
    try {
        const Employee = require('../models/Employee');
        const employee = await Employee.findOne({ user: req.user._id });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found' });
        }
        
        const query = { $or: [{ owner: employee._id }, { owner: { $exists: false } }, { owner: null }] };
        const docs = await Document.find(query).populate('owner', 'name');
        res.status(200).json({ success: true, count: docs.length, data: docs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
