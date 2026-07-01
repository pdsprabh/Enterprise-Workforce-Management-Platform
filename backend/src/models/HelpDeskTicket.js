const mongoose = require('mongoose');

const HelpDeskTicketSchema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('HelpDeskTicket', HelpDeskTicketSchema);
