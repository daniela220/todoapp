import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Bienvenida.css';

export function Bienvenida() {
  return (
    <div className="welcome-container">
      <h1>¡Bienvenido!</h1>
      <h2>Esta aplicación te permitirá mantener organizados tus proyectos.</h2>
      <Link to="/login">
        <button className="welcome-button">Ir al Login</button>
      </Link>
    </div>
  );
}
