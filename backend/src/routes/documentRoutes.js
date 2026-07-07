const express = require('express');
const router = express.Router();
const {
    getAllDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getMyDocuments,
    getDocumentStats
} = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

// Regular users – view own documents
router.get('/me', getMyDocuments);

// Super Admin – stats
router.get(
    '/stats',
    authorize('Super Admin'),
    getDocumentStats
);

// Super Admin – cross-tenant list + upload
router.route('/')
    .get(
        authorize('Super Admin', 'Organization Admin', 'HR Manager', 'IT Administrator', 'Employee'),
        getAllDocuments
    )
    .post(
        authorize('Super Admin', 'HR Manager', 'Employee'),
        upload.single('file'),
        createDocument
    );

// Super Admin – update / delete by ID
router.route('/:id')
    .put(
        authorize('Super Admin'),
        upload.single('file'),
        updateDocument
    )
    .delete(
        authorize('Super Admin'),
        deleteDocument
    );

module.exports = router;
