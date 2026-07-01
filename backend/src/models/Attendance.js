const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    clockIn: {
        type: Date
    },
    clockOut: {
        type: Date
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'half-day', 'on-leave', 'late'],
        default: 'present'
    },
    workHours: {
        type: Number,
        default: 0
    },
    notes: {
        type: String
    }
}, { timestamps: true });

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);