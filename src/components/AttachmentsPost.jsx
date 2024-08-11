import React, { useState } from 'react';

const API_BASE_URL = 'https://sandbox.academiadevelopers.com';

export function AttachmentsPost() {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);

        // Solo agregar el archivo si existe
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/taskmanager/attachments/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
                body: formData
            });

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Error Details:', errorDetails);
                throw new Error(errorDetails.file ? errorDetails.file[0] : 'Error al crear el adjunto');
            }

            // Leer y manejar la respuesta JSON solo si es exitosa
            const result = await response.json();
            setSuccessMessage('Adjunto creado exitosamente');
            setName('');
            setFile(null);  // Limpiar el archivo
            console.log('Nuevo Attachment creado:', result);
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div>
            <h1>Crear un nuevo Adjunto</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre del Adjunto:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="file">Archivo:</label>
                    <input
                        type="file"
                        id="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
                <button type="submit">Crear Adjunto</button>
            </form>
        </div>
    );
}
