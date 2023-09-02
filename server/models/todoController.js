// controllers/todoController.js
const Todo = require('./todo');

// Create a new todo
exports.createTodo = async (req, res) => {
  try {
    const todo = new Todo(req.body);
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create todo' });
  }
};

// Read all todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch todos' });
  }
};

// Update a todo
exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update todo' });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndRemove(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete todo' });
  }
};
