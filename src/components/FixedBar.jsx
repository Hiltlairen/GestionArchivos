import React from 'react';
import '../styles/fixedbar.css';

const FixedBar = () => {
    return (
      <div className="fixed-bar">
        {/* Cuadro de búsqueda + Filtros */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar documentos..." 
            className="search-input"
          />
          <select className="search-filter">
            <option value="">Clase ▼</option>
            <option value="contratos">Contratos</option>
            <option value="actas">Actas</option>
            <option value="facturas">Facturas</option>
          </select>
          <button className="search-btn">Buscar</button>
        </div>
      </div>
    );
  };
  
  export default FixedBar;