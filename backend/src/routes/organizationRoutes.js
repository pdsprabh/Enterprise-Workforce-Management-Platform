const express = require('express');
const router = express.Router();
const { getOrganizations, createOrganization } = require('../controllers/organizationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getOrganizations)
    .post(authorize('Super Admin'), createOrganization);

module.exports = router;
