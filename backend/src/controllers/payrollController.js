const Payroll = require('../models/Payroll');

exports.generatePayroll = async (req, res) => {
    try {
        const payroll = await Payroll.create(req.body);
        res.status(201).json({ success: true, data: payroll });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Payroll for this employee for this month/year already exists' });
        }
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getPayslips = async (req, res) => {
    try {
        let query = {};
        // If employee, only get their own payslips
        // If employee, find their employee ID automatically
        if (req.user.role === 'Employee') {
            const Employee = require('../models/Employee');
            const employee = await Employee.findOne({ user: req.user._id });
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee profile not found' });
            }
            query.employee = employee._id;
        }

        const payslips = await Payroll.find(query).populate('employee', 'name employeeId department');
        res.status(200).json({ success: true, count: payslips.length, data: payslips });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMyPayslips = async (req, res) => {
    try {
        const Employee = require('../models/Employee');
        const employee = await Employee.findOne({ user: req.user._id });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found' });
        }
        
        const payslips = await Payroll.find({ employee: employee._id }).sort({ year: -1, month: -1 });
        res.status(200).json({ success: true, count: payslips.length, data: payslips });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
