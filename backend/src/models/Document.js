const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    documentName: {
        type: String,
        required: [true, 'Document name is required']
    },
    docType: {
        type: String,
        enum: ['Policy', 'ID Proof', 'Certificate', 'Offer Letter', 'Other'],
        required: true
    },
    url: {
        type: String,
        required: [true, 'Document URL is required']
    },
    owner: {
        // Can be null if it's a company-wide policy document
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
