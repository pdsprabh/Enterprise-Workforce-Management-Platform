const express = require('express');
const router = express.Router();
const { createDocument, getDocuments, getMyDocuments } = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/me', getMyDocuments);
router.route('/')
    .get(authorize('Super Admin', 'Organization Admin', 'HR Manager', 'IT Administrator', 'Finance', 'Employee'), getDocuments)
    .post(authorize('Super Admin', 'HR Manager', 'Employee'), createDocument);

module.exports = router;
