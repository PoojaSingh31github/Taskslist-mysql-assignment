import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/alltask');
      console.log(response);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (inputText.trim() !== '') {
      try {
        await axios.post('http://localhost:5000/addtask', { task: inputText });
        setInputText('');
        fetchTasks();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/deletetask/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = async () => {
    if (editTaskId && inputText.trim() !== '') {
      try {
        await axios.put(`http://localhost:5000/updatetask/${editTaskId}`, { task: inputText });
        setInputText('');
        setEditTaskId(null);
        fetchTasks();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const startEditing = (taskId, taskText) => {
    setEditTaskId(taskId);
    setInputText(taskText);
  };

  return (
    <>
      <div className="main-container">
        <h1 className="app-heading"> add task</h1>
        <div className="input-container">
          <input
            type="text"
            className="input-box-todo"
            placeholder="Enter your todo"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          {editTaskId ? (
            <button className="edit-btn" onClick={handleEditTask}><i class="fa-solid fa-pen-to-square"></i></button>
          ) : (
            <button className="add-btn" onClick={handleAddTask}>+</button>
          )}

        <h1 className="app-heading"> all task</h1>
          {tasks.map(p => (
            <div key={p.id} className="task-item">
              <h3 className="list-item">
                {editTaskId === p.id ? (
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                ) : (
                  <span>{p.lists}</span>
                )}
                {editTaskId !== p.id && (
                  <>
                    <i className="fa-solid fa-trash iconsDelete" onClick={() => handleDeleteTask(p.id)}></i>
                    <i className="fa-solid fa-edit iconsEdit" onClick={() => startEditing(p.id, p.lists)}></i>
                  </>
                )}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
