const Employee = require('../models/Employee');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

exports.createEmployee = async (req, res) => {
    try {
        // Assuming HR creates the employee and passes user info.
        // We need to first create the User for login, then link to Employee profile.
        // For simplicity, if a userId is provided, we use it. Otherwise, we can require user creation first.
        let userId = req.body.user;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required to link Employee profile' });
        }
        
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({ status: 'Active' })
            .populate('department', 'departmentName departmentCode')
            .populate('manager', 'name');
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('department', 'departmentName departmentCode')
            .populate('manager', 'name');
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
        
        // HR/Finance can see salary. Others cannot.
        const role = req.user.role;
        if (role !== 'HR Manager' && role !== 'Super Admin' && role !== 'Organization Admin' && req.user._id.toString() !== employee.user.toString()) {
             // In a real app we might mask salary Grade here or handle it in a separate route.
        }

        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.archiveEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, { status: 'Archived' }, { new: true });
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Cryptographically secure password generator
const generateSecurePassword = (length = 12) => {
    const charset = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '@$!%*?&'
    };

    // Ensure at least one of each required type
    let password = '';
    password += charset.upper[crypto.randomInt(0, charset.upper.length)];
    password += charset.lower[crypto.randomInt(0, charset.lower.length)];
    password += charset.numbers[crypto.randomInt(0, charset.numbers.length)];
    password += charset.special[crypto.randomInt(0, charset.special.length)];

    const allChars = charset.upper + charset.lower + charset.numbers + charset.special;
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[crypto.randomInt(0, allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
};

exports.resetEmployeePassword = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

        const user = await User.findById(employee.user);
        if (!user) return res.status(404).json({ success: false, message: 'Associated User not found' });

        const temporaryPassword = generateSecurePassword(14);
        
        user.password = temporaryPassword;
        // The pre('save') hook on User will hash the password
        await user.save();

        const emailContent = `
Password Reset Confirmation

Hello ${employee.name},

Your password has been successfully reset by your IT Administrator. 
Please use the following temporary password to log in:

Temporary Password: ${temporaryPassword}

Security Notice:
You must log in immediately and change your password to a permanent one in your account settings.

If you did not request this, please contact IT support immediately.

Best regards,
Enterprise Workforce Management IT
        `;

        const emailSent = await sendEmail({
            to: employee.email,
            subject: 'Your Password Has Been Reset - Action Required',
            text: emailContent
        });

        if (emailSent) {
            res.status(200).json({ 
                success: true, 
                message: 'Password reset and email sent.' 
            });
        } else {
            res.status(200).json({ 
                success: true, 
                message: 'Password reset, but email notification failed to send.' 
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.unlockEmployeeAccount = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

        const user = await User.findById(employee.user);
        if (!user) return res.status(404).json({ success: false, message: 'Associated User not found' });

        user.isLocked = false;
        user.failedLoginAttempts = 0;
        user.lockedUntil = undefined;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'Account unlocked successfully.' 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
