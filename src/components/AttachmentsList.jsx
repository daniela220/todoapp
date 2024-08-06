import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://sandbox.academiadevelopers.com';

async function fetchAttachments() {
  const response = await fetch(`${API_BASE_URL}/taskmanager/attachments/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener los adjuntos');
  }
  return response.json();
}

async function createAttachment(formData) {
  const response = await fetch(`${API_BASE_URL}/taskmanager/attachments/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Error al crear el adjunto');
  }
  return response.json();
}

async function fetchAttachment(id) {
  const response = await fetch(`${API_BASE_URL}/taskmanager/attachments/${id}/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener el adjunto');
  }
  return response.json();
}

async function updateAttachment(id, formData) {
  const response = await fetch(`${API_BASE_URL}/taskmanager/attachments/${id}/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el adjunto');
  }
  return response.json();
}

async function deleteAttachment(id) {
  const response = await fetch(`${API_BASE_URL}/taskmanager/attachments/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el adjunto');
  }
}

export function AttachmentsList() {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAttachment, setNewAttachment] = useState({ name: '', file: null });
  const [editAttachment, setEditAttachment] = useState({ id: null, name: '', file: null });

  useEffect(() => {
    async function loadAttachments() {
      try {
        const data = await fetchAttachments();
        setAttachments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadAttachments();
  }, []);

  async function handleDelete(id) {
    try {
      await deleteAttachment(id);
      setAttachments(attachments.filter((attachment) => attachment.id !== id));
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newAttachment.name);
    formData.append('file', newAttachment.file);

    try {
      const newAttachmentData = await createAttachment(formData);
      setAttachments([...attachments, newAttachmentData]);
      setNewAttachment({ name: '', file: null }); // Limpiar form
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editAttachment.name);
    if (editAttachment.file) {
      formData.append('file', editAttachment.file);
    }

    try {
      const updatedAttachment = await updateAttachment(editAttachment.id, formData);
      setAttachments(
        attachments.map((attachment) =>
          attachment.id === editAttachment.id ? updatedAttachment : attachment
        )
      );
      setEditAttachment({ id: null, name: '', file: null }); // Limpiar formu
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Attachments</h1>
      <form onSubmit={handleCreate}>
        <div>
          <label htmlFor="name">Nombre del Adjunto</label>
          <input
            type="text"
            id="name"
            value={newAttachment.name}
            onChange={(e) => setNewAttachment({ ...newAttachment, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="file">Archivo</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setNewAttachment({ ...newAttachment, file: e.target.files[0] })}
            required
          />
        </div>
        <button type="submit">Crear nuevo adjunto</button>
      </form>
      
      <form onSubmit={handleUpdate}>
        <div>
          <label htmlFor="editName">Actualizar Nombre</label>
          <input
            type="text"
            id="editName"
            value={editAttachment.name}
            onChange={(e) => setEditAttachment({ ...editAttachment, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="editFile">Actualizar Archivo</label>
          <input
            type="file"
            id="editFile"
            onChange={(e) => setEditAttachment({ ...editAttachment, file: e.target.files[0] })}
          />
        </div>
        <button type="submit">Actualizar adjunto</button>
      </form>

      <ul>
        {attachments.map((attachment) => (
          <li key={attachment.id}>
            {attachment.name}
            <button onClick={() => setEditAttachment({ id: attachment.id, name: attachment.name, file: null })}>
              Editar
            </button>
            <button onClick={() => handleDelete(attachment.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
