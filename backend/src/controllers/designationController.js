const Designation = require('../models/Designation');

exports.createDesignation = async (req, res) => {
    try {
        const designation = await Designation.create(req.body);
        res.status(201).json({ success: true, data: designation });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Designation title must be unique' });
        }
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getDesignations = async (req, res) => {
    try {
        let query = {};
        if (req.query.department) {
            query.department = req.query.department;
        }

        const designations = await Designation.find(query).populate('department', 'departmentName');
        res.status(200).json({ success: true, count: designations.length, data: designations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
