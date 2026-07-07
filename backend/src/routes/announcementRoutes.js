const express = require('express');
const router = express.Router();
const {
    createAnnouncement,
    getAnnouncements,
    deleteAnnouncement
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getAnnouncements)
    .post(authorize('Organization Admin', 'Super Admin'), createAnnouncement);

router.delete(
    '/:id',
    authorize('Organization Admin', 'Super Admin'),
    deleteAnnouncement
);

module.exports = router;
