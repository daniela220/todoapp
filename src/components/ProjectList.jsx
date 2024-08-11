import React, { useState, useEffect, useRef } from 'react';
import "../css/ProjectList.css";

// Función para obtener proyectos desde la API con parámetros
const fetchProjects = async (page, pageSize) => {
  const API_URL = `https://sandbox.academiadevelopers.com/taskmanager/projects/?page=${page}&page_size=${pageSize}&ordering=-created_at`;
  
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Función para eliminar un proyecto por ID
const deleteProject = async (id) => {
  const API_URL = `http://sandbox.academiadevelopers.com/taskmanager/projects/${id}/`;

  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
    });

    if (response.status !== 204) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Función para actualizar un proyecto por ID
const updateProject = async (id, projectData) => {
  const API_URL = `http://sandbox.academiadevelopers.com/taskmanager/projects/${id}/`;

  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Componente para mostrar y actualizar la lista de proyectos
export function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
  });

  const formRef = useRef(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects(pagination.currentPage, pagination.pageSize);
        setProjects(data.results);
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(data.count / pagination.pageSize)
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [pagination.currentPage]);

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter(project => project.id !== id));
      setSuccessMessage("Project deleted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const { id, name, description } = editProject;

    try {
      const updatedProject = await updateProject(id, { name, description });
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      setSuccessMessage("Project updated successfully!");
      setEditProject(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditProject(prevProject => ({ ...prevProject, [name]: value }));
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination(prevPagination => ({
        ...prevPagination,
        currentPage: page
      }));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="project-list-container">
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="project-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h2>{project.name}</h2>
            <p><strong>ID:</strong> {project.id}</p> {/* Mostrar ID del proyecto */}
            <p><strong>Description:</strong> {project.description || 'N/A'}</p>
            <p><strong>Owner:</strong> {project.owner || 'N/A'}</p>
            <p><strong>Members:</strong> {project.members?.join(', ') || 'N/A'}</p>
            <div className="project-actions">
              <button className="delete-button" onClick={() => handleDelete(project.id)}>Delete</button>
              <button className="edit-button" onClick={() => handleEdit(project)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
      {editProject && (
        <form ref={formRef} onSubmit={handleUpdate} className="edit-form">
          <h2>Edit Project</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={editProject.name}
              onChange={handleEditChange}
              required
              maxLength={100}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={editProject.description || ''}
              onChange={handleEditChange}
              rows="4"
              maxLength={200}
            />
          </label>
          <button type="submit">Update Project</button>
          <button type="button" onClick={() => setEditProject(null)}>Cancel</button>
        </form>
      )}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          Previous
        </button>
        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProjectList;
