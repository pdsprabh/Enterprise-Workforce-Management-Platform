const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Helper to generate Refresh Token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE
    });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password, recaptchaToken } = req.body;

        // Verify reCAPTCHA
        if (recaptchaToken) {
            const recaptchaRes = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
            );
            if (!recaptchaRes.data.success) {
                return res.status(400).json({ success: false, message: 'Invalid reCAPTCHA' });
            }
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if account is locked
        if (user.isLocked) {
            return res.status(403).json({ success: false, message: 'Account locked due to multiple failed login attempts. Contact admin.' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            user.failedLoginAttempts += 1;
            if (user.failedLoginAttempts >= 5) {
                user.isLocked = true;
            }
            await user.save({ validateBeforeSave: false });
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Login successful, reset failed attempts
        user.failedLoginAttempts = 0;
        
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            token,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                mobile: user.mobile
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get new access token using refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'No refresh token provided' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

// @desc    Register user (For initial setup or admin use)
// @route   POST /api/auth/register
// @access  Private/Admin
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, mobile } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'Employee',
            mobile
        });

        // Automatically create an Employee profile for the newly registered user
        const Employee = require('../models/Employee');
        await Employee.create({
            user: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            joiningDate: new Date(),
            status: 'Active'
        });

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.status(201).json({
            success: true,
            token,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                mobile: user.mobile
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Logout user / clear refresh token
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.refreshToken = null;
            await user.save({ validateBeforeSave: false });
        }
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                mobile: user.mobile
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = await User.create({
                name: payload.name,
                email: payload.email,
                googleId: payload.sub,
                role: 'Employee'
            });
            const Employee = require('../models/Employee');
            await Employee.create({
                user: user._id,
                name: user.name,
                email: user.email,
                joiningDate: new Date(),
                status: 'Active'
            });
        } else if (!user.googleId) {
            user.googleId = payload.sub;
            await user.save({ validateBeforeSave: false });
        }

        const authToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            token: authToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, mobile: user.mobile }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Google Auth Failed' });
    }
};

// @desc    Microsoft Login
// @route   POST /api/auth/microsoft
// @access  Public
exports.microsoftLogin = async (req, res) => {
    try {
        const { token } = req.body;
        // Verify MS token with Graph API
        const msRes = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const payload = msRes.data;
        const email = payload.userPrincipalName || payload.mail;
        
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: payload.displayName,
                email: email,
                microsoftId: payload.id,
                role: 'Employee'
            });
            const Employee = require('../models/Employee');
            await Employee.create({
                user: user._id,
                name: user.name,
                email: user.email,
                joiningDate: new Date(),
                status: 'Active'
            });
        } else if (!user.microsoftId) {
            user.microsoftId = payload.id;
            await user.save({ validateBeforeSave: false });
        }

        const authToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            token: authToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, mobile: user.mobile }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Microsoft Auth Failed' });
    }
};
