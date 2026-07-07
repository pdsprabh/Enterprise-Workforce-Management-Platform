const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    documentName: {
        type: String,
        required: [true, 'Document name is required'],
        trim: true
    },
    docType: {
        type: String,
        enum: ['Policy', 'ID Proof', 'Certificate', 'Offer Letter', 'Other'],
        required: [true, 'Document type is required']
    },
    url: {
        type: String,
        required: [true, 'Document URL is required']
    },
    // Cloudinary public_id for deletion
    cloudinaryPublicId: {
        type: String
    },
    // Owner employee (optional – null for org-wide or platform-wide docs)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    // Organization association (null = platform-wide)
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    // Which roles may view this document (empty = all roles in the org)
    allowedRoles: {
        type: [String],
        enum: ['Organization Admin', 'HR Manager', 'Employee', 'IT Administrator'],
        default: []
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
