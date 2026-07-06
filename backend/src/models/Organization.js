const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name for the organization'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    industry: {
        type: String,
        default: 'Technology'
    }
}, { timestamps: true });

module.exports = mongoose.model('Organization', OrganizationSchema);
