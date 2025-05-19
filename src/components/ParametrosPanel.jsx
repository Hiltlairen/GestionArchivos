import React, { useState } from 'react';
import '../App.css';

const ParametrosPanel = ({ 
  columns,
  onAddColumn,
  onDeleteColumn,
  position = "left"
}) => {
  const [newColumnName, setNewColumnName] = useState('');

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      onAddColumn(newColumnName.trim());
      setNewColumnName('');
    }
  };

  const panelStyle = {
    width: '250px',
    backgroundColor: 'var(--color-card)',
    borderRadius: '0.5rem',
    padding: '1rem',
    boxShadow: 'var(--shadow-md)',
    margin: position === 'left' ? '0 1rem 0 0' : '0 0 0 1rem',
    alignSelf: 'flex-start',
    position: 'sticky',
    top: '160px' // Ajuste para FixedBar
  };

  return (
    <div style={panelStyle}>
      <h3 style={{ 
        marginTop: '0',
        color: 'var(--color-primary)',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '0.5rem'
      }}>
        Parámetros
      </h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.9rem',
          color: 'var(--color-text)'
        }}>
          Nuevo parámetro:
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Nombre del parámetro"
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid var(--color-border)',
              borderRadius: '4px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleAddColumn}
            style={{ padding: '0.5rem' }}
          >
            +
          </button>
        </div>
      </div>

      <div>
        <h4 style={{ 
          margin: '0.5rem 0',
          fontSize: '0.9rem',
          color: 'var(--color-text)'
        }}>
          Parámetros existentes:
        </h4>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {columns.map((column, index) => (
            <li key={index} style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--color-border)'
            }}>
              <span style={{ fontSize: '0.85rem' }}>{column}</span>
              <button
                onClick={() => onDeleteColumn(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-error)',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
                title="Eliminar parámetro"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ParametrosPanel;