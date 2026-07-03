const express = require('express');
const router = express.Router();
const { createEmployee, getEmployees, getEmployee, updateEmployee, archiveEmployee } = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(authorize('Super Admin', 'Organization Admin', 'HR Manager', 'Employee'), getEmployees)
    .post(authorize('Super Admin', 'Organization Admin', 'HR Manager', 'Employee'), createEmployee);

router.route('/:id')
    .get(getEmployee) // Allow anyone to get, but controller filters sensitive data
    .put(authorize('Super Admin', 'Organization Admin', 'HR Manager'), updateEmployee)
    .delete(authorize('Super Admin', 'Organization Admin', 'HR Manager'), archiveEmployee);

module.exports = router;
