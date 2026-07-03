const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
        default: 'planning'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);