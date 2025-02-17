const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { validateTask } = require('./middleware/validation');

const app = express();
const PORT = 3000;
const tasksFilePath = path.join(__dirname, 'tasks.json');

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Helper function to read tasks
const readTasks = () => {
    const data = fs.readFileSync(tasksFilePath);
    return JSON.parse(data);
};

// Helper function to write tasks
const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// GET all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// GET a single task by ID
app.get('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
});

// POST a new task
app.post('/tasks', validateTask, (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        status: req.body.status || 'todo',
        dueDate: req.body.dueDate || '00:00:00', // Default due time
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

// PUT (update) a task by ID
app.put('/tasks/:id', validateTask, (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) return res.status(404).json({ message: 'Task not found' });

    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
});

// DELETE a task by ID
app.delete('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) return res.status(404).json({ message: 'Task not found' });

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});