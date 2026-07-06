const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'full-time', 'part-time', 'contract'
  applicants: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  location: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('JobPosting', jobPostingSchema);
