import React, { useState, useEffect } from "react";
import "../css/Profile.css";

export function Profile() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        console.log("Token obtenido de localStorage:", token);

        if (!token) {
            setError("No auth token found. Please log in.");
            setIsLoading(false);
            return;
        }

        fetch("https://sandbox.academiadevelopers.com/users/profiles/", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            credentials: "include",
        })
        .then(async (response) => {
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || response.statusText);
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

        fetch("https://sandbox.academiadevelopers.com/api-auth/logout/", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            credentials: "include",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to logout");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            setUser(null);
            localStorage.removeItem("authToken");
            window.location.href = "/login";
        })
        .catch((e) => {
            console.error("Error during logout:", e);
        });
    }

    if (isLoading) return <div className="loading-message">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                {user ? (
                    <div>
                        <h1 className="profile-heading">User Profile</h1>
                        <p className="profile-text">Nombre de usuario: {user.username}</p>
                        <p className="profile-text">Email: {user.email}</p>
                        <button className="profile-button" onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <div>
                        <p>No se ha iniciado sesión</p>
                        <div className="profile-buttons">
                            <button onClick={() => (window.location.href = "/login")}>Iniciar sesión</button>
                            <button onClick={() => (window.location.href = "/signup")}>Registrarse</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
