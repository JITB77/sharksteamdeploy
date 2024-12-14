import express from 'express';
import { getTasks, getTask, getCompletedTasks, createTask, updateTaskCompletion, deleteTask, updateTask, getImportantTasks } from '../data/tasks.js';


const router = express.Router();

// Route to get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await getTasks();
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
});

// Route to get a task by id
router.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await getTask(id);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve task' });
    }
});

// Route to get all completed tasks
router.get('/tasks/completed', async (req, res) => {
    try {
        const completedTasks = await getCompletedTasks();
        res.status(200).json(completedTasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve completed tasks' });
    }
});

// Route to get all important tasks (priority = 1)
router.get('/tasks/important', async (req, res) => {
    try {
        const importantTasks = await getImportantTasks();
        res.status(200).json(importantTasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve important tasks' });
    }
});


// Route to create a new task
router.post('/tasks', async (req, res) => {
    try {
        const { name, description, deadline, priority, completed } = req.body;

        const newTask = await createTask({
            name,
            description,
            deadline,
            priority,
            completed
        });

        // Respond with the newly created task
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// Route to update a task's completion status
router.patch('/tasks/:id/completed', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const updatedTask = await updateTaskCompletion(id, completed);
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update task completion' });
    }
});

// Route to update task details
router.patch('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const updatedTask = await updateTask(id, updatedData);
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Route to delete a task
router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await deleteTask(id);
        res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});
export default router
