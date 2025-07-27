const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware'); // Adjust path as needed
const {
    addTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    toggleTaskStatus,
} = require('../controllers/taskController');

// Protect routes by adding authenticateToken as middleware
router.post('/add', authenticateToken, addTask);
router.get('/all', authenticateToken, getAllTasks);
router.get('/:id', authenticateToken, getTaskById);
router.put('/update/:id', authenticateToken, updateTask);
router.delete('/delete/:id', authenticateToken, deleteTask);
router.put('/toggle-status/:id', authenticateToken, toggleTaskStatus);

module.exports = router;
