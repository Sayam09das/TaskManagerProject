const Task = require('../models/taskModel');

// Add Task
const addTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and Description are required' });
        }

        const newTask = await Task.create({
            title,
            description,
            userId: req.userId // Ensure this is set by the authenticateToken middleware
        });

        res.status(201).json({ success: true, task: newTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get All Tasks (for logged-in user only)
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId });
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Single Task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Task
const updateTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { title, description },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }
        res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// Toggle Task Status
const toggleTaskStatus = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }

        let newStatus;
        if (task.status === 'pending') {
            newStatus = 'in-progress';
        } else if (task.status === 'in-progress') {
            newStatus = 'completed';
        } else if (task.status === 'completed') {
            newStatus = 'pending';
        }


        task.status = newStatus;
        await task.save();

        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    toggleTaskStatus,
};
