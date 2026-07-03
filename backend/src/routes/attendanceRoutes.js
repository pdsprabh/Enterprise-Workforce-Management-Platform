const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    clockIn,
    clockOut,
    getMyAttendance,
    getAllAttendance
} = require('../controllers/attendanceController');

router.post('/clock-in', protect, clockIn);
router.post('/clock-out', protect, clockOut);
router.get('/me', protect, getMyAttendance);
router.get('/', protect, authorize('HR Manager', 'Super Admin', 'Organization Admin'), getAllAttendance);

module.exports = router;