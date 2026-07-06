const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    createCandidate,
    uploadResume,
    analyzeResume,
    getCandidates,
    getCandidateById,
    scheduleInterview,
    updateCandidateStatus,
    getJobPostings,
    createJobPosting
} = require('../controllers/recruitmentController');

router.get('/jobs', protect, getJobPostings);
router.post('/jobs', protect, authorize('HR Manager', 'Super Admin'), createJobPosting);


router.post('/candidates', protect, createCandidate);
router.post('/candidates/:id/resume', protect, upload.single('resume'), uploadResume);
router.post('/candidates/:id/analyze', protect, analyzeResume);
router.get('/candidates', protect, getCandidates);
router.get('/candidates/:id', protect, getCandidateById);
router.put('/candidates/:id/schedule-interview', protect, authorize('HR Manager', 'Super Admin'), scheduleInterview);
router.put('/candidates/:id/status', protect, authorize('HR Manager', 'Super Admin'), updateCandidateStatus);

module.exports = router;