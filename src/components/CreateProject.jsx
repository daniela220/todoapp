import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/CreateProject.css";

export const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState('');
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

    const projectData = {
      name,
      description: description || undefined, // Enviar `undefined` si description está vacío
      members: members.split(',').map(member => parseInt(member.trim(), 10)).filter(id => !isNaN(id)) // Convertir a números y filtrar valores NaN
    };

    try {
      const response = await fetch('https://sandbox.academiadevelopers.com/taskmanager/projects/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, ${errorText}`);
      }

      const data = await response.json();
      console.log('Project created:', data);

      navigate('/projects'); // Redirige a la lista de proyectos
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100} // Ajustado a la longitud máxima permitida por la API
              minLength={1}
            />
          </label>
        </div>
        <div>
          <label>
            Description (optional):
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
            Members (comma-separated IDs):
            <input
              type="text"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="Enter member IDs separated by commas"
            />
          </label>
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
        {error && <p>Error: {error}</p>}
      </form>
    </div>
  );
};
