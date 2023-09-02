import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [assignedTo, setAssignedTo] = useState("");
  const [taskState, setTaskState] = useState("todo");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedState, setEditedState] = useState("");
  const [editedAssignedTo, setEditedAssignedTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredState, setFilteredState] = useState("all");
  const filteredTodos = todos.filter((todo) => {
    const stateMatch = filteredState === "all" || todo.state === filteredState;
    const searchMatch = todo.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return stateMatch && searchMatch;
  });
  const handleOpenEditForm = (todo) => {
    setIsEditing(true);
    setEditingTodo(todo);
    setEditedTitle(todo.title);
    setEditedDescription(todo.description);
    setEditedDueDate(todo.dueDate);
    setEditedState(todo.state);
    setEditedAssignedTo(todo.assignedTo);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  const handleSaveEdit = () => {
    axios
      .put(`http://localhost:8080/api/todos/${editingTodo._id}`, {
        title: editedTitle,
        description: editedDescription,
        dueDate: editedDueDate,
        state: editedState,
        assignedTo: editedAssignedTo,
        completed: editingTodo.completed,
      })
      .then((response) => {
        const updatedTodos = todos.map((todo) => {
          if (todo._id === editingTodo._id) {
            return response.data;
          }
          return todo;
        });
        setTodos(updatedTodos);
        cancelEdit();
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingTodo(null);
    setEditedTitle("");
    setEditedDescription("");
    setEditedDueDate("");
    setEditedState("");
    setEditedAssignedTo("");
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  const handleStateChange = (id, currentState) => {
    let newState;
    if (currentState === "todo") {
      newState = "inprogress";
    } else if (currentState === "inprogress") {
      newState = "done";
    } else {
      // If the current state is "done", you may choose to handle it differently
      // For example, you could set it back to "todo" or leave it as is
      newState = currentState;
    }

    axios
      .put(`http://localhost:8080/api/todos/${id}`, { state: newState })
      .then((response) => {
        const updatedTodos = todos.map((todo) => {
          if (todo._id === id) {
            todo.state = newState;
          }
          return todo;
        });
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("Error changing state:", error);
      });
  };

  const handleAddTodo = () => {
    axios
      .post("http://localhost:8080/api/todos", {
        title: newTodo,
        description: newDescription,
        dueDate: dueDate,
        state: taskState,
        completed: false,
        assignedTo: assignedTo,
      })
      .then((response) => {
        setTodos([...todos, response.data]);
        setNewTodo("");
        setNewDescription("");
        setDueDate(new Date().toISOString().split("T")[0]);
        setAssignedTo("");
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  const handleUpdateTodo = (id, completed) => {
    axios
      .put(`http://localhost:8080/api/todos/${id}`, { completed: !completed })
      .then((response) => {
        const updatedTodos = todos.map((todo) => {
          if (todo._id === id) {
            todo.completed = !completed;
          }
          return todo;
        });
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  };

  const handleDeleteTodo = (id) => {
    axios
      .delete(`http://localhost:8080/api/todos/${id}`)
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Task Management</h1>
        <div className="filter-search">
          <select
            className="select"
            value={filteredState}
            onChange={(e) => setFilteredState(e.target.value)}
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <input
            className="input"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="white_btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <h1 className="title">Todo List</h1>
      <div className="input-container">
        <input
          className="input"
          type="text"
          placeholder="Task title"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Team Member"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <input
          className="input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          className="select"
          value={taskState}
          onChange={(e) => setTaskState(e.target.value)}
        >
          <option value="todo">Todo</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button className="add-button" onClick={handleAddTodo}>
          Add
        </button>
      </div>
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo._id} className="todo-item">
            <input
              className="checkbox"
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleUpdateTodo(todo._id, todo.completed)}
            />
            <strong className="todo-title">{todo.title}</strong>
            <p className="todo-description">{todo.description}</p>
            <p className="todo-due-date">Due Date: {todo.dueDate}</p>
            <p className="todo-state">State: {todo.state}</p>
            <p className="todo-assignee">Assigned To: {todo.assignedTo}</p>
            <button
              className="delete-button"
              onClick={() => handleDeleteTodo(todo._id)}
            >
              Delete
            </button>
            <button
              className="change-state-button"
              onClick={() => handleStateChange(todo._id, todo.state)}
            >
              Change State
            </button>
            {isEditing && editingTodo._id === todo._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
                <input
                  type="date"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                />
                <select
                  value={editedState}
                  onChange={(e) => setEditedState(e.target.value)}
                >
                  <option value="todo">Todo</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <input
                  type="text"
                  placeholder="Assign to Team Member"
                  value={editedAssignedTo}
                  onChange={(e) => setEditedAssignedTo(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
                <button className="cancel" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                {/* Display task details */}
                {/* ... (previous JSX code) */}
                <button
                  className="add-button2"
                  onClick={() => handleOpenEditForm(todo)}
                >
                  Edit
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
