const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    assetName: {
        type: String,
        required: [true, 'Asset name is required']
    },
    assetType: {
        type: String,
        required: [true, 'Asset type is required'] // e.g., Laptop, Monitor, Phone
    },
    serialNumber: {
        type: String,
        unique: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    status: {
        type: String,
        enum: ['Available', 'Assigned', 'Maintenance', 'Retired'],
        default: 'Available'
    },
    purchaseDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);
