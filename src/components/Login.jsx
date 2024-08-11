import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../css/Login.css";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    fetch("https://sandbox.academiadevelopers.com/api-auth/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
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
      if (data?.token) {
        localStorage.setItem("authToken", data.token);
        // Verificar si el token se ha almacenado correctamente
        console.log("Token almacenado:", localStorage.getItem("authToken"));
        navigate("/profile");
      } else {
        throw new Error("Token no recibido");
      }
    })
    .catch((error) => {
      setError(error.message);
      console.error("Error:", error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="login-container container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="formUsername" className="formLabel">Nombre de Usuario</label>
          <input
            required
            type="text"
            className="formInput"
            id="formUsername"
            placeholder="Ingresa tu usuario"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="formPassword" className="formLabel">Contraseña</label>
          <input
            required
            type="password"
            className="formInput"
            id="formPassword"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}
