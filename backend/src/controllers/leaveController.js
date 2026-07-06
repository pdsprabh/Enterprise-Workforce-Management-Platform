const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

const getEmployeeFromUser = async (userId) => {
    let employee = await Employee.findOne({ user: userId });
    if (!employee) {
        const User = require('../models/User');
        const user = await User.findById(userId);
        if (user) {
            employee = await Employee.create({
                user: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                joiningDate: new Date(),
                status: 'Active'
            });
        }
    }
    return employee;
};

exports.applyLeave = async (req, res) => {
    try {
        const employee = await getEmployeeFromUser(req.user._id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found for this user' });
        }

        const { leaveType, startDate, endDate, reason } = req.body;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (totalDays <= 0) {
            return res.status(400).json({ success: false, message: 'End date must be after start date' });
        }

        const leave = await Leave.create({
            employee: employee._id,
            leaveType,
            startDate: start,
            endDate: end,
            totalDays,
            reason,
            status: 'pending'
        });

        res.status(201).json({ success: true, data: leave });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMyLeaves = async (req, res) => {
    try {
        const employee = await getEmployeeFromUser(req.user._id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found for this user' });
        }
        const leaves = await Leave.find({ employee: employee._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: leaves.length, data: leaves });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
        }

        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        leave.status = status;
        const approverEmployee = await getEmployeeFromUser(req.user._id);
        if (approverEmployee) leave.approvedBy = approverEmployee._id;

        await leave.save();
        res.status(200).json({ success: true, data: leave });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getLeaveBalance = async (req, res) => {
    try {
        const employee = await getEmployeeFromUser(req.user._id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found for this user' });
        }

        const ANNUAL_LEAVE_QUOTA = 24;

        const approvedLeaves = await Leave.find({ employee: employee._id, status: 'approved' });
        const usedDays = approvedLeaves.reduce((sum, l) => sum + l.totalDays, 0);

        res.status(200).json({
            success: true,
            data: {
                totalQuota: ANNUAL_LEAVE_QUOTA,
                used: usedDays,
                remaining: ANNUAL_LEAVE_QUOTA - usedDays
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate({
            path: 'employee',
            populate: { path: 'user', select: 'firstName lastName' }
        }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: leaves.length, data: leaves });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};