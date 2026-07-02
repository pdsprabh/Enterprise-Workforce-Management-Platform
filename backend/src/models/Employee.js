const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
    mobile: {
        type: String,
        match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits']
    },
    address: String,
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    bloodGroup: String,
    dob: Date,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    designation: String,
    joiningDate: {
        type: Date,
        required: [true, 'Joining Date is required'],
        validate: {
            validator: function (v) {
                return v <= new Date();
            },
            message: 'Joining Date cannot exceed current date'
        }
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    employmentType: String,
    salaryGrade: String,
    status: {
        type: String,
        enum: ['Active', 'Archived'],
        default: 'Active'
    }
}, { timestamps: true });

// Pre-save hook to generate employeeId if it doesn't exist
EmployeeSchema.pre('save', async function() {
    if (!this.employeeId) {
        // Generate an ID like EMP1023
        const count = await this.constructor.countDocuments();
        this.employeeId = `EMP${(count + 1).toString().padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
