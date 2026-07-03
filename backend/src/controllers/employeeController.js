const Employee = require('../models/Employee');
const User = require('../models/User');

exports.createEmployee = async (req, res) => {
    try {
        // Assuming HR creates the employee and passes user info.
        // We need to first create the User for login, then link to Employee profile.
        // For simplicity, if a userId is provided, we use it. Otherwise, we can require user creation first.
        let userId = req.body.user;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required to link Employee profile' });
        }
        
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({ status: 'Active' })
            .populate('department', 'departmentName departmentCode')
            .populate('manager', 'name');
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('department', 'departmentName departmentCode')
            .populate('manager', 'name');
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
        
        // HR/Finance can see salary. Others cannot.
        const role = req.user.role;
        if (role !== 'HR Manager' && role !== 'Super Admin' && role !== 'Organization Admin' && req.user._id.toString() !== employee.user.toString()) {
             // In a real app we might mask salary Grade here or handle it in a separate route.
        }

        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.archiveEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, { status: 'Archived' }, { new: true });
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
