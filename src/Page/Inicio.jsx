import React, { useState } from 'react';
import '../App.css';
import FixedBar from '../components/FixedBar';

const Inicio = () => {
    return (
      <>
        <FixedBar />
        <div className="container" style={{ marginTop: '140px' }}> {/* Ajuste por Header + FixedBar */}
          <h1>¡Bienvenido a URT (Unidad de Registro Territorial)!</h1>
          <h2>Busca y administra documentos fácilmente por clase, nombre o número de libreta.</h2>
        </div>
      </>
    );
  };
  
  export default Inicio;