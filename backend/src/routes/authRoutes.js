const express = require('express');
const router = express.Router();
const { login, register, refreshToken, logout, getMe, googleLogin, microsoftLogin } = require('../controllers/authController');
const { validateLogin, validateRegistration } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', validateLogin, login);
router.post('/google', googleLogin);
router.post('/microsoft', microsoftLogin);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// In a real scenario, register should be protected and only accessible to HR/Admin.
// Protect with JWT + role check so only authorised admins can onboard new users.
// The register endpoint now requires a valid token from HR Manager, Org Admin, or Super Admin.
router.post('/register', protect, authorize('Super Admin', 'Organization Admin', 'HR Manager'), validateRegistration, register);

module.exports = router;
