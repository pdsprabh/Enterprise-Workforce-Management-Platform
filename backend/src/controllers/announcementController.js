const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { sendNotificationToEmployee } = require('../socket/socketManager');

// @desc  Create announcement & notify all org employees
// @route POST /api/announcements
// @access Organization Admin, Super Admin
exports.createAnnouncement = async (req, res) => {
    try {
        const { title, message, priority } = req.body;

        if (!title || !message) {
            return res.status(400).json({ success: false, message: 'Title and message are required' });
        }

        // Determine organization: Org Admin uses their own org, Super Admin can pass organizationId
        let organizationId = req.body.organizationId || null;

        if (req.user.role === 'Organization Admin') {
            // Org admins can only post to their own org — derive from their employee record
            const orgAdminEmployee = await Employee.findOne({ user: req.user._id });
            if (orgAdminEmployee?.organization) {
                organizationId = orgAdminEmployee.organization;
            }
        }

        const announcement = await Announcement.create({
            title,
            message,
            priority: priority || 'info',
            organization: organizationId,
            createdBy: req.user.id
        });

        // Send in-app notifications to all employees in the org
        const employeeQuery = organizationId
            ? { organization: organizationId }
            : {};

        const employees = await Employee.find(employeeQuery).select('_id');

        const notifications = employees.map(emp => ({
            recipient: emp._id,
            title,
            message,
            type: 'general',
            relatedId: announcement._id
        }));

        if (notifications.length > 0) {
            const created = await Notification.insertMany(notifications);
            // Push live via socket
            created.forEach(notif => {
                sendNotificationToEmployee(notif.recipient.toString(), notif);
            });
        }

        const populated = await Announcement.findById(announcement._id)
            .populate('createdBy', 'name role')
            .populate('organization', 'name');

        res.status(201).json({ success: true, data: populated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Get announcements (org-scoped or all for Super Admin)
// @route GET /api/announcements
// @access All authenticated
exports.getAnnouncements = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'Organization Admin') {
            const orgAdminEmployee = await Employee.findOne({ user: req.user._id });
            if (orgAdminEmployee?.organization) {
                query.organization = orgAdminEmployee.organization;
            }
        } else if (req.user.role !== 'Super Admin') {
            // Regular employees see their org announcements
            const employee = await Employee.findOne({ user: req.user._id });
            if (employee?.organization) {
                query.organization = employee.organization;
            }
        }

        const announcements = await Announcement.find(query)
            .populate('createdBy', 'name role')
            .populate('organization', 'name')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({ success: true, count: announcements.length, data: announcements });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc  Delete an announcement
// @route DELETE /api/announcements/:id
// @access Organization Admin, Super Admin
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        await announcement.deleteOne();
        res.status(200).json({ success: true, message: 'Announcement deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
