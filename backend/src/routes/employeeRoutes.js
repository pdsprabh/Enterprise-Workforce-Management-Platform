const express = require('express');
const router = express.Router();
const { 
    createEmployee, 
    getEmployees, 
    getEmployee, 
    updateEmployee, 
    archiveEmployee,
    resetEmployeePassword,
    unlockEmployeeAccount
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(authorize('Super Admin', 'Organization Admin', 'HR Manager', 'Employee', 'IT Administrator'), getEmployees)
    .post(authorize('Super Admin', 'Organization Admin', 'HR Manager'), createEmployee);

router.route('/:id')
    .get(getEmployee) // Allow anyone to get, but controller filters sensitive data
    .put(authorize('Super Admin', 'Organization Admin', 'HR Manager'), updateEmployee)
    .delete(authorize('Super Admin', 'Organization Admin', 'HR Manager'), archiveEmployee);

router.post('/:id/reset-password', authorize('Super Admin', 'IT Administrator'), resetEmployeePassword);
router.post('/:id/unlock-account', authorize('Super Admin', 'IT Administrator'), unlockEmployeeAccount);

module.exports = router;
