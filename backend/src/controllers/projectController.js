const Project = require('../models/Project');
const Task = require('../models/Task');
const { createAndSendNotification } = require('./notificationController');

exports.createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('manager', 'name').populate('teamMembers', 'name');
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('manager', 'name').populate('teamMembers', 'name');
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);

        if (task.assignedTo) {
            try {
                await createAndSendNotification({
                    recipient: task.assignedTo,
                    title: 'New Task Assigned',
                    message: `You have been assigned a new task: ${task.title}`,
                    type: 'task-assigned',
                    relatedId: task._id
                });
            } catch (notifErr) {
                console.error('Notification failed:', notifErr.message);
            }
        }

        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name');
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMyTasks = async (req, res) => {
    try {
        const Employee = require('../models/Employee');
        const employee = await Employee.findOne({ user: req.user._id });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        const tasks = await Task.find({ assignedTo: employee._id }).populate('project', 'name');
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};