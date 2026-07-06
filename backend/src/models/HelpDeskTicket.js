const mongoose = require('mongoose');

const HelpDeskTicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Ticket title is required']
    },
    description: {
        type: String,
        required: [true, 'Ticket description is required']
    },
    raisedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['it', 'hr', 'admin', 'facilities', 'other'],
        required: [true, 'Ticket category is required']
    },
    assignedToIT: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    }
}, { timestamps: true });

module.exports = mongoose.model('HelpDeskTicket', HelpDeskTicketSchema);
