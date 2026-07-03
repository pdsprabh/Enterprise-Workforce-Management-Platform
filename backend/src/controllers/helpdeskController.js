const HelpDeskTicket = require('../models/HelpDeskTicket');

exports.createTicket = async (req, res) => {
    try {
        const ticket = await HelpDeskTicket.create(req.body);
        res.status(201).json({ success: true, data: ticket });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getTickets = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Employee') {
            if (!req.query.raisedBy) {
                return res.status(400).json({ success: false, message: 'raisedBy query required' });
            }
            query.raisedBy = req.query.raisedBy;
        }

        const tickets = await HelpDeskTicket.find(query)
            .populate('raisedBy', 'name')
            .populate('assignedToIT', 'name');
            
        res.status(200).json({ success: true, count: tickets.length, data: tickets });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
