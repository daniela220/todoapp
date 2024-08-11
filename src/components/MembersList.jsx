import React, { useEffect, useState } from "react";

export function MembersList() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          throw new Error("No auth token found");
        }

        const response = await fetch("https://sandbox.academiadevelopers.com/taskmanager/members/", {
          method: "GET",
          headers: {
            "Authorization": `Token ${token}`, // Incluye el token en el encabezado
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const responseBody = await response.json(); // Cambiado a .json() directamente

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Asegúrate de que la clave `results` contenga el array que necesitas
        if (Array.isArray(responseBody.results)) {
          setMembers(responseBody.results);
        } else {
          throw new Error("Response data is not in the expected format.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Lista de Miembros</h2>
      <ul>
        {members.length > 0 ? (
          members.map(member => (
            <li key={member.id}>{member.id}</li>
          ))
        ) : (
          <li>No members found</li>
        )}
      </ul>
    </div>
  );
}
