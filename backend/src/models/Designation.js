const mongoose = require('mongoose');

const DesignationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Designation title is required'],
        unique: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Department reference is required']
    },
    description: String,
    level: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

module.exports = mongoose.model('Designation', DesignationSchema);
