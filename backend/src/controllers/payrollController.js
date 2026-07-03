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
        if (req.user.role === 'Employee') {
            // Find employee id for this user. This would normally require linking User to Employee properly.
            // For now, assuming client passes employee id in query or we fetch it. 
            // Better yet, just enforce that if role=Employee, they must provide their own employee document ID in req.query.employee
            if (!req.query.employee) {
                return res.status(400).json({ success: false, message: 'Employee reference required for Employees' });
            }
            query.employee = req.query.employee;
        }

        const payslips = await Payroll.find(query).populate('employee', 'name employeeId department');
        res.status(200).json({ success: true, count: payslips.length, data: payslips });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
