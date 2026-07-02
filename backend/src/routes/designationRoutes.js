const express = require('express');
const router = express.Router();
const { createDesignation, getDesignations } = require('../controllers/designationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getDesignations)
    .post(authorize('Super Admin', 'Organization Admin', 'HR Manager'), createDesignation);

module.exports = router;
