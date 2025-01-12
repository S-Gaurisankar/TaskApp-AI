// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Model for your task schema

// Example: Fetch all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add other CRUD routes as needed (POST, UPDATE, DELETE, etc.)

module.exports = router;
