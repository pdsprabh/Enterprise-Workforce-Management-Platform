const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    basicSalary: {
        type: Number,
        required: true,
        default: 0
    },
    hra: {
        type: Number,
        default: 0
    },
    bonus: {
        type: Number,
        default: 0
    },
    overtime: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Ensure one payroll per employee per month/year
PayrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

// Pre-save hook to automatically calculate netSalary
PayrollSchema.pre('save', function() {
    this.netSalary = (this.basicSalary + this.hra + this.bonus + this.overtime) - this.deductions;
});

module.exports = mongoose.model('Payroll', PayrollSchema);
