const express = require('express');
const router = express.Router();
const { createTicket, getTickets } = require('../controllers/helpdeskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(authorize('Super Admin', 'Organization Admin', 'HR Manager', 'IT Administrator', 'Employee'), getTickets)
    .post(authorize('Employee', 'Super Admin', 'IT Administrator'), createTicket);

module.exports = router;
