// models/Todo.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: String,
  description: String, // Added description field
  dueDate: Date, // Added dueDate field of type Date
  state: {
    type: String,
    enum: ['todo', 'inprogress', 'done'],
    default: 'todo', // Added state field with default value 'todo'
  },
  completed: Boolean,
  assignedTo: String,
});

module.exports = mongoose.model('Todo', todoSchema);
