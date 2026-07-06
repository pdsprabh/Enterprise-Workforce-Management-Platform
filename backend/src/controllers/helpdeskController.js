const HelpDeskTicket = require('../models/HelpDeskTicket');

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
            query.category = 'it'; // IT sees IT tickets
        } else if (req.user.role === 'HR Manager') {
            query.category = 'hr'; // HR sees HR tickets
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
