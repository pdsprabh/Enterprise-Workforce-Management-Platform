const express = require('express');
const router = express.Router();
const { createDepartment, getDepartments, getDepartment, updateDepartment, archiveDepartment } = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Super Admin', 'Organization Admin', 'HR Manager'));

router.route('/')
    .get(getDepartments)
    .post(createDepartment);

router.route('/:id')
    .get(getDepartment)
    .put(updateDepartment)
    .delete(archiveDepartment); // mapped delete method to archive

module.exports = router;
