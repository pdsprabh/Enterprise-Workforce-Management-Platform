const HelpDeskTicket = require('../models/HelpDeskTicket');
const { createAndSendNotification } = require('./notificationController');

exports.createTicket = async (req, res) => {
    try {
        req.body.raisedBy = req.user._id; // enforce security
        const ticket = await HelpDeskTicket.create(req.body);
        res.status(201).json({ success: true, data: ticket });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getTickets = async (req, res) => {
    try {
        let query = {};
        
        // RBAC logic for tickets
        if (req.user.role === 'Employee') {
            query.raisedBy = req.user._id; // only see their own tickets
        } else if (req.user.role === 'IT Administrator') {
            query.$or = [{ category: 'it' }, { raisedBy: req.user._id }];
        } else if (req.user.role === 'HR Manager') {
            query.$or = [{ category: 'hr' }, { raisedBy: req.user._id }];
        }
        // Super Admin and Org Admin will have an empty query (see all)

        const tickets = await HelpDeskTicket.find(query)
            .populate('raisedBy', 'name')
            .populate('assignedToIT', 'name')
            .sort({ createdAt: -1 }); // newest first
            
        res.status(200).json({ success: true, count: tickets.length, data: tickets });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, message: 'Status is required' });
        }

        const ticket = await HelpDeskTicket.findById(id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        ticket.status = status;
        await ticket.save();

        // Notify the ticket raiser
        const Employee = require('../models/Employee');
        const raisedByEmployee = await Employee.findOne({ user: ticket.raisedBy });
        
        if (raisedByEmployee) {
            await createAndSendNotification({
                recipient: raisedByEmployee._id,
                title: 'Ticket Status Updated',
                message: `Your IT Support ticket "${ticket.title}" status is now: ${status}`,
                type: 'ticket-status',
                relatedId: ticket._id
            });
        }

        res.status(200).json({ success: true, data: ticket });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
