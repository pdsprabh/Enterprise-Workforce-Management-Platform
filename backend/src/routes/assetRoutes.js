const express = require('express');
const router = express.Router();
const { createAsset, getAssets, updateAsset, deleteAsset } = require('../controllers/assetController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(authorize('Super Admin', 'Organization Admin', 'HR Manager', 'IT Administrator', 'Employee'), getAssets)
    .post(authorize('Super Admin', 'IT Administrator'), createAsset);

router.route('/:id')
    .put(authorize('Super Admin', 'IT Administrator'), updateAsset)
    .delete(authorize('Super Admin', 'IT Administrator'), deleteAsset);

module.exports = router;
