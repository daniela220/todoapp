import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://sandbox.academiadevelopers.com';

async function fetchAttachments() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }
  console.log('Token:', token); // Verifica que el token esté presente
  const response = await fetch(`${API_BASE_URL}/taskmanager/attachments/`, {
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener los adjuntos: ' + response.statusText);
  }
  return response.json();
}

export function AttachmentsList() {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAttachments() {
      try {
        const data = await fetchAttachments();
        console.log('Adjuntos obtenidos:', data);

        // Verifica que `data.results` sea un array y úsalo
        if (data && Array.isArray(data.results)) {
          setAttachments(data.results);
        } else {
          setAttachments([]);
          console.error('La clave `results` no es un array o no existe:', data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadAttachments();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Attachments</h1>
      <ul>
        {attachments.map((attachment) => (
          <li key={attachment.id}>
            <p><strong>Nombre:</strong> {attachment.name}</p>
            {/* Si el campo `file` está disponible, muestra la URL del archivo */}
            {attachment.file && (
              <p>
                <strong>Archivo:</strong>{' '}
                <a href={attachment.file} target="_blank" rel="noopener noreferrer">
                  Ver archivo
                </a>
              </p>
            )}
            {/* Aquí puedes agregar las funciones de edición y eliminación */}
          </li>
        ))}
      </ul>
    </div>
  );
}
