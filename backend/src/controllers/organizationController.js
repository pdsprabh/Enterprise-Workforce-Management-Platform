const Organization = require('../models/Organization');

// @desc    Get all organizations
// @route   GET /api/organizations
// @access  Private (Super Admin)
exports.getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.status(200).json({ success: true, count: organizations.length, data: organizations });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a new organization
// @route   POST /api/organizations
// @access  Private (Super Admin)
exports.createOrganization = async (req, res) => {
    try {
        const organization = await Organization.create(req.body);
        res.status(201).json({ success: true, data: organization });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
