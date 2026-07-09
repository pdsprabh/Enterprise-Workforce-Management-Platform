const Performance = require('../models/Performance');
const Employee = require('../models/Employee');

// GET /api/performance/me
exports.getMyPerformance = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }
    
    let perf = await Performance.findOne({ employee: employee._id });
    if (!perf) {
      perf = await Performance.create({ employee: employee._id, goals: [], reviews: [], feedback: [] });
    }
    
    res.status(200).json({ success: true, data: perf });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/performance/goals
exports.addGoal = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee profile not found' });
    
    let perf = await Performance.findOne({ employee: employee._id });
    if (!perf) perf = await Performance.create({ employee: employee._id });
    
    perf.goals.push(req.body);
    await perf.save();
    
    res.status(201).json({ success: true, data: perf });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/performance/goals/:goalId
exports.updateGoal = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    const perf = await Performance.findOne({ employee: employee._id });
    if (!perf) return res.status(404).json({ success: false, message: 'Performance record not found' });
    
    const goal = perf.goals.id(req.params.goalId);
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    
    if (req.body.progress !== undefined) goal.progress = req.body.progress;
    if (req.body.status !== undefined) goal.status = req.body.status;
    
    await perf.save();
    res.status(200).json({ success: true, data: perf });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
