const Notification = require('../models/Notification');
const Employee = require('../models/Employee');
const { sendNotificationToEmployee } = require('../socket/socketManager');

const getEmployeeFromUser = async (userId) => {
    return await Employee.findOne({ user: userId });
};

// Helper other controllers can call to create + push a notification
exports.createAndSendNotification = async ({ recipient, title, message, type, relatedId }) => {
    const notification = await Notification.create({ recipient, title, message, type, relatedId });
    sendNotificationToEmployee(recipient, notification);
    return notification;
};

// @desc    Get logged-in employee's notifications
// @route   GET /api/notifications/me
exports.getMyNotifications = async (req, res) => {
    try {
        const employee = await getEmployeeFromUser(req.user._id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found for this user' });
        }
        const notifications = await Notification.find({ recipient: employee._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};