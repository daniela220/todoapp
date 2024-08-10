// src/components/Welcome.js
import React from 'react';
import { Link } from 'react-router-dom';
// Si decides usar CSS, asegúrate de que el archivo esté disponible y descomenta la línea
// import './Welcome.css';

export function Bienvenida() {
  return (
    <div className="welcome-container">
      <h1>¡Bienvenido!</h1>
      <h2>Esta aplicación te permitirá mantener un orden de tus tareas diarias</h2>
      <Link to="/login">
        <button className="welcome-button">Ir al Login</button>
      </Link>
    </div>
  );
}
