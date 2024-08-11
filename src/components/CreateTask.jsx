// src/components/CreateTask.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');
  const [project, setProject] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("No auth token found. Please log in.");
      setIsSubmitting(false);
      return;
    }

    const taskData = {
      title,
      description,
      due_date: dueDate,
      status,
      project,
      assigned_to: assignedTo
    };

    try {
      const response = await fetch('https://sandbox.academiadevelopers.com/taskmanager/tasks/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, ${errorText}`);
      }

      const data = await response.json();
      console.log('Task created:', data);
      navigate('/tasks'); // Redirige a la lista de tareas o a otra página según sea necesario
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create New Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              minLength={1}
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              cols="50"
            />
          </label>
        </div>
        <div>
          <label>
            Due Date:
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Status:
            <input
              type="number"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              min="0" // Ajusta según los valores válidos para el estado
            />
          </label>
        </div>
        <div>
          <label>
            Project ID:
            <input
              type="number"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Assigned To (User ID):
            <input
              type="number"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
        {error && <p>Error: {error}</p>}
      </form>
    </div>
  );
};
