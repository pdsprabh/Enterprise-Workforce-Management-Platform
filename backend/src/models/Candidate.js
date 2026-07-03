const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    positionAppliedFor: {
        type: String,
        required: true
    },
    resumeUrl: {
        type: String
    },
    resumeText: {
        type: String
    },
    aiAnalysis: {
        summary: String,
        matchScore: Number,
        skills: [String]
    },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'interview-scheduled', 'rejected', 'hired'],
        default: 'applied'
    },
    interview: {
        scheduledAt: Date,
        interviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        mode: {
            type: String,
            enum: ['in-person', 'video-call', 'phone-call']
        },
        notes: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);