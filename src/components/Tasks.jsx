// src/components/TaskList.js
import React, { useState, useEffect } from 'react';

// Función para obtener tareas desde la API
const fetchTasks = async (page, pageSize) => {
  const API_URL = 'http://sandbox.academiadevelopers.com/taskmanager/tasks/';
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No auth token found. Please log in.");
  }

  try {
    const params = new URLSearchParams({
      page: page,
      page_size: pageSize,
      ordering: '-created_at',
    }).toString();

    const response = await fetch(`${API_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Función para eliminar una tarea por ID
const deleteTask = async (taskId) => {
  const API_URL = `http://sandbox.academiadevelopers.com/taskmanager/tasks/${taskId}/`;
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No auth token found. Please log in.");
  }

  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete task. Status: ${response.status}, ${errorText}`);
    }

    // Retorna true si la tarea se eliminó correctamente
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Componente para mostrar la lista de tareas
export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks(pagination.page, pagination.pageSize);
        setTasks(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [pagination.page]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      setLoading(true);
      const success = await deleteTask(taskId);
      if (success) {
        setTasks(tasks.filter(task => task.id !== taskId)); // Remover la tarea de la lista local
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Task List</h1>
      
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <h2>{task.title}</h2>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Project:</strong> {task.project}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Due Date:</strong> {task.due_date}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Assigned to:</strong> {task.assigned_to}</p>
            <p><strong>Tags:</strong> {task.tags}</p>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button> {/* Botón para eliminar tarea */}
          </li>
        ))}
      </ul>

      {/* Controles de paginación */}
      <div>
        <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>
          Previous
        </button>
        <span>Page {pagination.page}</span>
        <button onClick={() => handlePageChange(pagination.page + 1)} disabled={tasks.length < pagination.pageSize}>
          Next
        </button>
      </div>
    </div>
  );
};
