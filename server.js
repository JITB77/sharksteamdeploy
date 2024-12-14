import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import apiRouter from './routes/api.js';
import { getTasks, getTask, getCompletedTasks, createTask, updateTaskCompletion, deleteTask, updateTask, getImportantTasks } from './data/tasks.js';
import { exec } from 'child_process'; // Import exec from child_process

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run the seed-db.js script before starting the server
exec('node ./config/seed-db.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing seed-db.js: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  
  // Once the database is seeded, start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', apiRouter);

app.get('/', async (req, res) => {
    try {
        const tasks = await getImportantTasks(); // Fetch important tasks from the database
        res.render('index', { tasks }); // Pass tasks to the view
    } catch (error) {
        console.error('Error fetching important tasks:', error);
        res.status(500).send('Error fetching tasks');
    }
});

app.get('/tasks', async (req, res) => {
    try {
        // Fetch upcoming and completed tasks
        const upcomingTasks = await getTasks({ completed: false });
        const completedTasks = await getCompletedTasks();
        res.render('tasks', { upcomingTasks, completedTasks }); // Render tasks.ejs with the tasks data
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Error fetching tasks');
    }
});

app.get('/addnewtask', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'addnew.html'));
});

app.get('/taskinfo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'info.html'));
});

app.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await getTask(id); // Fetch the task by ID
        res.render('info', { task });  // Pass the task to the EJS view
    } catch (error) {
        console.error('Error retrieving task:', error);
        res.status(500).render('info', { task: null });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    let { id } = req.params;
    id = parseInt(id, 10); // Ensure the id is an integer
    if (isNaN(id)) {
        return res.status(400).send('Invalid task ID');
    }

    try {
        await deleteTask(id); // Delete the task
        res.status(204).send(); // Respond with 204 No Content if successful
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Error deleting task');
    }
});

app.patch('/tasks/:id/toggle-completed', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
        const updatedTask = await updateTaskCompletion(id, completed);
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task completion:', error);
        res.status(500).send('Failed to update task status');
    }
});

app.put('/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const updatedData = req.body;

    try {
        const updatedTask = await updateTask(taskId, updatedData); // Update the task in place
        res.status(200).json(updatedTask); // Respond with the updated task
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
});
