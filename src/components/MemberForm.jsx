import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function MemberForm() {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState(""); // ID del proyecto
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectId) {
      setError({ message: "Project ID is required" });
      return;
    }

    setIsLoading(true);
    try {
      const url = "https://sandbox.academiadevelopers.com/taskmanager/members/";
      const data = {
        project: parseInt(projectId, 10), // Convertir la ID del proyecto a un entero
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("authToken")}`, // Añade el token de autorización
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Intentar leer la respuesta como texto por si no es JSON
        const errorText = await response.text();
        throw new Error(`Error adding member: ${errorText}`);
      }

      // Redirige a la lista de miembros después de una creación exitosa
      navigate("/members");
    } catch (error) {
      setError({ message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Añadir Miembro</h2>
      <div>
        <label>
          Project ID:
          <input
            type="number"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="ID del proyecto"
            required
          />
        </label>
      </div>
      <button type="submit" disabled={isLoading}>
        Añadir
      </button>
      {isLoading && <div>Loading...</div>}
      {error && <div className="error-message">Error: {error.message}</div>}
    </form>
  );
}
