import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";

export function Profile() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        console.log("Token obtenido de localStorage:", token);

        if (!token) {
            setError("No auth token found. Please log in.");
            setIsLoading(false);
            return;
        }

        fetch("https://sandbox.academiadevelopers.com/users/profiles/profile_data/",
            {
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`, // Asegúrate de que el token esté en el formato correcto
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        )
        .then(async (response) => {
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error fetching profile data: ${errorText || response.statusText}`);
            }

            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                const errorText = await response.text();
                throw new Error(`Unexpected content type: ${contentType}. Response: ${errorText}`);
            }
        })
        .then((data) => {
            setUser(data);
            setIsLoading(false);
        })
        .catch((e) => {
            setError(e.message);
            setIsLoading(false);
        });
    }, []);

    function logout() {
        const token = localStorage.getItem("authToken");

        if (!token) {
            console.error("No token found for logout");
            setError("No token found for logout");
            return;
        }

        fetch("https://sandbox.academiadevelopers.com/users/profiles/logout/", {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`, // Asegúrate de que el formato del token sea el correcto
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then(async (response) => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Logout failed: ${response.status} ${errorText}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Logout response:", data);
            setUser(null);
            localStorage.removeItem("authToken");
            navigate("/login"); // Redirige a la página de login
        })
        .catch((e) => {
            console.error("Error during logout:", e);
            setError(`Failed to logout: ${e.message}`);
        });
    }

    if (isLoading) return <div className="loading-message">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                {user ? (
                    <div>
                        <h1 className="profile-heading">Datos de usuario</h1>
                        <p className="profile-text">Nombre de usuario: {user.username}</p>
                        <p className="profile-text">Email: {user.email}</p>
                        <div className="button-container">
                            <button className="profile-button" onClick={logout}>Logout</button>
                            <button className="profile-button" onClick={() => navigate("/attachments")}>Ver Tareas</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>No se ha iniciado sesión</p>
                        <div className="profile-buttons">
                            <button onClick={() => navigate("/login")}>Iniciar sesión</button>
                            <button onClick={() => navigate("/signup")}>Registrarse</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
