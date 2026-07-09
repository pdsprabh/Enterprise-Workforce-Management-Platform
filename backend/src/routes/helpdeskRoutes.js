const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateTicketStatus } = require('../controllers/helpdeskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(authorize('Super Admin', 'Organization Admin', 'HR Manager', 'IT Administrator', 'Employee'), getTickets)
    .post(authorize('Super Admin', 'Organization Admin', 'HR Manager', 'IT Administrator', 'Employee'), createTicket);

router.route('/:id/status')
    .put(authorize('Super Admin', 'Organization Admin', 'HR Manager', 'IT Administrator'), updateTicketStatus);

module.exports = router;
