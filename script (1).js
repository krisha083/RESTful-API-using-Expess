document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    // Fetch and display tasks
    const fetchTasks = async () => {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        taskList.innerHTML = tasks.map(task => `
            <li>
                <strong>${task.title}</strong> - ${task.status}
                <button onclick="deleteTask(${task.id})">Delete</button>
            </li>
        `).join('');
    };

    // Add a new task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const status = document.getElementById('status').value;

        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, status }),
        });

        if (response.ok) {
            fetchTasks();
            taskForm.reset();
        }
    });

    // Delete a task
    window.deleteTask = async (id) => {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
    };

    fetchTasks();
});