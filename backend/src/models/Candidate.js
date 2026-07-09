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
        detailedOverview: String,
        overallScore: Number,
        adaScore: Number,
        strengths: [String],
        weaknesses: [String],
        languages: [String],
        relevantTechnologies: [String]
    },
    status: {
        type: String,
        enum: ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected', 'shortlisted', 'interview-scheduled'],
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