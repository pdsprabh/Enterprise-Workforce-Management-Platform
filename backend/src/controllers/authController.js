const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
        const { email, password } = req.body;

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
