// src/components/TaskList.js
import React, { useState, useEffect } from 'react';

// Función para obtener tareas desde la API
const fetchTasks = async (params) => {
  const API_URL = 'http://sandbox.academiadevelopers.com/taskmanager/tasks/'; 
  const token = localStorage.getItem("authToken"); // Obtener el token del almacenamiento local

  if (!token) {
    throw new Error("No auth token found. Please log in.");
  }

  try {
    // Convertir parámetros en una cadena de consulta
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}?${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`, // Usar el token en el encabezado de autorización
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text(); // Obtener el texto del error
      throw new Error(`HTTP error! Status: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Componente para mostrar la lista de tareas
export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const params = {
          page: 1,
          page_size: 10,
          ordering: 'created_at'
        };
        const data = await fetchTasks(params);
        setTasks(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
          </li>
        ))}
      </ul>
    </div>
  );
};
