import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Inicio from './Page/Inicio';
import EditarHoja from './Page/EditarHoja';
import './App.css';

const App = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <Router>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <div className="content" style={{ marginTop: '80px' }}> {/* Espacio para el header fijo */}
        <Routes>
           <Route path="/" element={<Inicio />} />
            <Route path="/editar/:nombreHoja" element={<EditarHoja />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;