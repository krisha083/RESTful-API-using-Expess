const validateTask = (req, res, next) => {
    const { title, status, dueDate } = req.body;
    if (!title || typeof title !== 'string') {
        return res.status(400).json({ message: 'Title is required and must be a string' });
    }
    if (status && !['todo', 'in-progress', 'done'].includes(status)) {
        return res.status(400).json({ message: 'Status must be one of: todo, in-progress, done' });
    }
    if (dueDate && !/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(dueDate)) {
        return res.status(400).json({ message: 'Due date must be in HH:MM:SS format' });
    }
    next();
};

module.exports = { validateTask };