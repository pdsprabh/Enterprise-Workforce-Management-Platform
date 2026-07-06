const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  goals: [{
    title: { type: String, required: true },
    description: { type: String },
    progress: { type: Number, default: 0 },
    status: { type: String, enum: ['On Track', 'At Risk', 'Completed', 'Not Started'], default: 'Not Started' },
    dueDate: { type: Date }
  }],
  reviews: [{
    title: { type: String, required: true },
    reviewer: { type: String, required: true },
    date: { type: Date, default: Date.now },
    rating: { type: Number, min: 0, max: 5 },
    comments: { type: String }
  }],
  feedback: [{
    from: { type: String, required: true },
    role: { type: String },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
