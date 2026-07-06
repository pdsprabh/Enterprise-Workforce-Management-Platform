const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createProject,
    getProjects,
    getProjectById,
    createTask,
    getTasksByProject,
    getMyTasks,
    updateTaskStatus
} = require('../controllers/projectController');

router.post('/', protect, createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.post('/tasks', protect, createTask);
router.get('/tasks/me', protect, getMyTasks);
router.get('/:projectId/tasks', protect, getTasksByProject);
router.put('/tasks/:id/status', protect, updateTaskStatus);

module.exports = router;