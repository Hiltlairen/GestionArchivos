import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="header">
      {/* Logo + Nombre (link a Inicio) */}
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <span className="logo">URT</span>
          <span className="logo-text">Unidad de Registro Territorial</span>
        </Link>
      </div>

      {/* Menú de Navegación */}
      <nav className="nav-menu">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/agregar" className="nav-link">Agregar Documento</Link>
        <Link to="/clases" className="nav-link">Administrar Clases</Link>
        <Link to="/usuarios" className="nav-link">Usuarios</Link>
        <Link to="/reportes" className="nav-link">Reportes</Link>
        <Link to="/configuracion" className="nav-link">Configuración</Link>
        <Link to="/ayuda" className="nav-link">Ayuda</Link>
      </nav>

      {/* Selector de Tema */}
      <button 
        onClick={toggleTheme}
        className="btn-theme"
      >
        {theme === 'light' ? 'Oscuro 🌙' : 'Claro ☀️'}
      </button>
    </header>
  );
};

export default Header;