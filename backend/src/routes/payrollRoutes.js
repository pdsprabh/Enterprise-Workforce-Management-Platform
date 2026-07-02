const express = require('express');
const router = express.Router();
const { generatePayroll, getPayslips } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(authorize('Super Admin', 'Organization Admin', 'HR Manager', 'Finance', 'Employee'), getPayslips)
    .post(authorize('Super Admin', 'HR Manager', 'Finance'), generatePayroll);

module.exports = router;
