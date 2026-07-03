const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain uppercase, lowercase, number and special character'
        ],
        select: false // Do not return password by default
    },
    mobile: {
        type: String,
        match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits']
    },
    role: {
        type: String,
        enum: ['Super Admin', 'Organization Admin', 'HR Manager', 'Employee', 'IT Administrator'],
        required: [true, 'Role is required'],
        default: 'Employee'
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    lockedUntil: {
        type: Date
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if entered password matches the hashed password in db
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
