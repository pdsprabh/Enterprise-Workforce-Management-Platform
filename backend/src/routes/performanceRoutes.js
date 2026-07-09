const express = require('express');
const router = express.Router();
const { getMyPerformance, addGoal, updateGoal } = require('../controllers/performanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/me', getMyPerformance);
router.post('/goals', addGoal);
router.put('/goals/:goalId', updateGoal);

module.exports = router;
