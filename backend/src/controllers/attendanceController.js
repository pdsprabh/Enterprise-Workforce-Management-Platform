const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Helper: get the logged-in employee from req.user
const getEmployeeFromUser = async (userId) => {
    return await Employee.findOne({ user: userId });
};

// @desc    Clock in for today
// @route   POST /api/attendance/clock-in
exports.clockIn = async (req, res) => {
    try {
        const employee = await getEmployeeFromUser(req.user._id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found for this user' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendance = await Attendance.findOne({ employee: employee._id, date: today });

        if (attendance && attendance.clockIn) {
            return res.status(400).json({ success: false, message: 'Already clocked in today' });
        }

        if (!attendance) {
            attendance = new Attendance({
                employee: employee._id,
                date: today,
                clockIn: new Date(),
                status: 'present'
            });
        } else {
            attendance.clockIn = new Date();
        }

        await attendance.save();
        res.status(200).json({ success: true, data: attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Clock out for today
// @route   POST /api/attendance/clock-out
exports.clockOut = async (req, res) => {
    try {
        const employee = await getEmployeeFromUser(req.user._id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found for this user' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({ employee: employee._id, date: today });

        if (!attendance || !attendance.clockIn) {
            return res.status(400).json({ success: false, message: 'You have not clocked in today' });
        }
        if (attendance.clockOut) {
            return res.status(400).json({ success: false, message: 'Already clocked out today' });
        }

        attendance.clockOut = new Date();
        // calculate work hours
        const hours = (attendance.clockOut - attendance.clockIn) / (1000 * 60 * 60);
        attendance.workHours = Math.round(hours * 100) / 100;

        await attendance.save();
        res.status(200).json({ success: true, data: attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get logged-in employee's own attendance history
// @route   GET /api/attendance/me
exports.getMyAttendance = async (req, res) => {
    try {
        const employee = await getEmployeeFromUser(req.user._id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found for this user' });
        }
        const records = await Attendance.find({ employee: employee._id }).sort({ date: -1 });
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all attendance records (HR/Admin only)
// @route   GET /api/attendance
exports.getAllAttendance = async (req, res) => {
    try {
        const records = await Attendance.find().populate('employee', 'name employeeId');
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};