import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../css/Login.css";

export function Login2() {
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

    fetch("https://sandbox.academiadevelopers.com/api-auth", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    })
    .then((response) => {
      if (response.status === 401) {
        setError("Usuario o contraseña incorrectos");
      } else if (response.ok) {
        return response.json();
      } else {
        setError("Error desconocido");
      }
    })
    .then((data) => {
      if (data?.token) {
        localStorage.setItem("authToken", data.token);
        navigate("/profile");
      }
    })
    .catch((error) => {
      setError("Error en la conexión");
      console.log(error);
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
