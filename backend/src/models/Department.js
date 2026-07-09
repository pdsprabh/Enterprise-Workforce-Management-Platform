const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: [true, 'Department name is required']
    },
    departmentCode: {
        type: String,
        required: [true, 'Department code is required'],
        unique: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    status: {
        type: String,
        enum: ['Active', 'Archived'],
        default: 'Active'
    },
    budget: {
        type: Number,
        default: 0
    },
    budgetSpent: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with virtuals
DepartmentSchema.virtual('employees', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'department',
    justOne: false,
    count: true
});

module.exports = mongoose.model('Department', DepartmentSchema);
