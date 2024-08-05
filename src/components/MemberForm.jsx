import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function MemberForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? "PUT" : "POST";
    const url = id
      ? `https://sandbox.academiadevelopers.com/taskmanager/members/${id}/`
      : "https://sandbox.academiadevelopers.com/taskmanager/members/";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    })
      .then(response => response.json())
      .then(() => navigate("/members"))
      .catch(setError);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? "Editar Miembro" : "Añadir Miembro"}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del miembro"
        required
      />
      <button type="submit">{id ? "Actualizar" : "Añadir"}</button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
