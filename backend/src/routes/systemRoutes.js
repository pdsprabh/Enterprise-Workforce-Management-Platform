const express = require('express');
const router = express.Router();
const { getMetrics, updateMetrics, getAlerts, createAlert } = require('../controllers/systemController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/metrics')
    .get(getMetrics)
    .put(authorize('IT Administrator', 'Super Admin'), updateMetrics);

router.route('/alerts')
    .get(getAlerts)
    .post(authorize('IT Administrator', 'Super Admin'), createAlert);

module.exports = router;
