const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    },
    priority: {
        type: String,
        enum: ['info', 'warning', 'critical'],
        default: 'info'
    },
    // Organization the announcement belongs to (null = platform-wide)
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
