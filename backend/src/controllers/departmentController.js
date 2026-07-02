const Department = require('../models/Department');
const Employee = require('../models/Employee');

exports.createDepartment = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json({ success: true, data: department });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate('manager', 'name').populate('employees');
        res.status(200).json({ success: true, count: departments.length, data: departments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).populate('manager', 'name');
        if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
        res.status(200).json({ success: true, data: department });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
        res.status(200).json({ success: true, data: department });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.archiveDepartment = async (req, res) => {
    try {
        // Business Rule: Department cannot be deleted (or archived) if employees exist
        const employeesCount = await Employee.countDocuments({ department: req.params.id, status: 'Active' });
        if (employeesCount > 0) {
            return res.status(400).json({ success: false, message: 'Cannot archive department with active employees' });
        }
        
        const department = await Department.findByIdAndUpdate(req.params.id, { status: 'Archived' }, { new: true });
        if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
        
        res.status(200).json({ success: true, data: department });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
