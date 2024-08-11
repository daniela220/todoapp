import React, { useEffect, useState } from "react";

export function MembersList() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("No auth token found");
        }

        const query = new URLSearchParams({
          page: pagination.currentPage,
          page_size: pagination.pageSize,
        }).toString();

        const response = await fetch(`https://sandbox.academiadevelopers.com/taskmanager/members/?${query}`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const responseBody = await response.json();

        if (Array.isArray(responseBody.results)) {
          setMembers(responseBody.results);
          setPagination(prev => ({
            ...prev,
            totalPages: Math.ceil(responseBody.count / pagination.pageSize),
          }));
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
  }, [pagination.currentPage]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await fetch(`https://sandbox.academiadevelopers.com/taskmanager/members/${id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status !== 204) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Eliminar el miembro de la lista local después de una eliminación exitosa
      setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination(prevPagination => ({
        ...prevPagination,
        currentPage: page
      }));
    }
  };

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
            <li key={member.id}>
              <strong>ID:</strong> {member.id} <br />
              <strong>Proyecto:</strong> {member.project} <br />
              <strong>Usuario:</strong> {member.user} <br />
              <strong>Creado el:</strong> {new Date(member.created_at).toLocaleDateString()} <br />
              <strong>Actualizado el:</strong> {new Date(member.updated_at).toLocaleDateString()} <br />
              <button onClick={() => handleDelete(member.id)}>Eliminar</button>
            </li>
          ))
        ) : (
          <li>No members found</li>
        )}
      </ul>
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
