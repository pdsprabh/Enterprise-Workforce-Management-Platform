const express = require('express');
const router = express.Router();
const { login, register, refreshToken, logout } = require('../controllers/authController');
const { validateLogin, validateRegistration } = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);

// In a real scenario, register should be protected and only accessible to HR/Admin.
// We keep it open right now for initial seeding, but you can uncomment the protection middleware below.
// router.post('/register', protect, authorize('Super Admin', 'Organization Admin', 'HR Manager'), validateRegistration, register);
router.post('/register', validateRegistration, register);

module.exports = router;
