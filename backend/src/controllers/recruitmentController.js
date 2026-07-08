const Candidate = require('../models/Candidate');
const JobPosting = require('../models/JobPosting');
const cloudinary = require('../config/cloudinary');
const aiAssistant = require('../ai/aiAssistant');

// @desc    Create candidate application (basic info)
// @route   POST /api/recruitment/candidates
exports.createCandidate = async (req, res) => {
    try {
        const { name, email, mobile, positionAppliedFor } = req.body;
        const candidate = await Candidate.create({ name, email, mobile, positionAppliedFor });
        res.status(201).json({ success: true, data: candidate });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Upload resume for a candidate
// @route   POST /api/recruitment/candidates/:id/resume
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }

        // Check if Cloudinary is configured
        const isCloudinaryConfigured = process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key';

        if (isCloudinaryConfigured) {
            // upload buffer to cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'raw', folder: 'resumes' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            candidate.resumeUrl = uploadResult.secure_url;
        } else {
            // Fallback for local development when keys are not set
            candidate.resumeUrl = `http://localhost:5000/mock-resumes/${req.file.originalname}`;
        }

        await candidate.save();

        res.status(200).json({ success: true, data: candidate });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Run AI analysis on candidate's resume
// @route   POST /api/recruitment/candidates/:id/analyze
exports.analyzeResume = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }
        if (!candidate.resumeUrl) {
            return res.status(400).json({ success: false, message: 'No resume uploaded yet for this candidate' });
        }

        // placeholder call to AI assistant — actual text-extraction/AI logic to be refined
        try {
            const analysis = await aiAssistant.analyzeResume(candidate.resumeText || '');
            candidate.aiAnalysis = analysis;
        } catch (aiErr) {
            // AI assistant not fully implemented yet — store a stub so flow doesn't break
            candidate.aiAnalysis = { summary: 'AI analysis pending implementation', matchScore: null, skills: [] };
        }

        await candidate.save();
        res.status(200).json({ success: true, data: candidate });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all candidates
// @route   GET /api/recruitment/candidates
exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: candidates.length, data: candidates });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single candidate
// @route   GET /api/recruitment/candidates/:id
exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }
        res.status(200).json({ success: true, data: candidate });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Schedule interview for a candidate
// @route   PUT /api/recruitment/candidates/:id/schedule-interview
exports.scheduleInterview = async (req, res) => {
    try {
        const { scheduledAt, interviewer, mode, notes } = req.body;

        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }

        candidate.interview = { scheduledAt, interviewer, mode, notes };
        candidate.status = 'interview-scheduled';

        await candidate.save();
        res.status(200).json({ success: true, data: candidate });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update candidate status (shortlist/reject/hire)
// @route   PUT /api/recruitment/candidates/:id/status
exports.updateCandidateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected', 'shortlisted', 'interview-scheduled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const candidate = await Candidate.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }

        res.status(200).json({ success: true, data: candidate });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all job postings
// @route   GET /api/recruitment/jobs
exports.getJobPostings = async (req, res) => {
    try {
        const jobs = await JobPosting.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create a job posting
// @route   POST /api/recruitment/jobs
exports.createJobPosting = async (req, res) => {
    try {
        const job = await JobPosting.create(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};