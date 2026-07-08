const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    role: { type: String, default: 'Employee', enum: ['Employee', 'HR Manager', 'IT Administrator', 'Organization Admin', 'Super Admin'] },
    mobile: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    microsoftId: { type: String, unique: true, sparse: true },
    failedLoginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    refreshToken: { type: String }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
