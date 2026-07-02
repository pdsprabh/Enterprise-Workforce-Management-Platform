const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    applyLeave,
    getMyLeaves,
    updateLeaveStatus,
    getLeaveBalance
} = require('../controllers/leaveController');

router.post('/', protect, applyLeave);
router.get('/me', protect, getMyLeaves);
router.get('/balance', protect, getLeaveBalance);
router.put('/:id/status', protect, authorize('HR Manager', 'Super Admin', 'Organization Admin'), updateLeaveStatus);

module.exports = router;