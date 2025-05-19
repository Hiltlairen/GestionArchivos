import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import FixedBar from '../components/FixedBar';
import ParametrosPanel from '../components/ParametrosPanel';

const EditarHoja = () => {
  const { nombreHoja } = useParams();
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = "http://192.168.1.6:5000"; // IP local del backend

  useEffect(() => {
    if (!nombreHoja) return;
    fetchSheetData();
  }, [nombreHoja]);

  const fetchSheetData = async () => {
    setLoading(true);
    try {
      const encodedNombre = encodeURIComponent(nombreHoja);
      const response = await fetch(`${baseURL}/hoja/${encodedNombre}`);
      const result = await response.json();

      if (result.error) throw new Error(result.error);

      setColumns(result.columns || []);
      setData(result.data || []);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error al cargar la hoja: ${error.message}`);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleCellChange = async (rowIndex, colIndex, value) => {
    const newData = [...data];
    newData[rowIndex][columns[colIndex]] = value;
    setData(newData);

    try {
      const encodedNombre = encodeURIComponent(nombreHoja);
      await fetch(`${baseURL}/hoja/${encodedNombre}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cell: {
            row: rowIndex + 1,
            col: colIndex,
            value: value
          }
        })
      });
    } catch (error) {
      console.error("Error al guardar celda:", error);
      fetchSheetData();
    }
  };

  const addNewRow = async () => {
    try {
      const encodedNombre = encodeURIComponent(nombreHoja);
      const response = await fetch(`${baseURL}/hoja/${encodedNombre}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al añadir fila");
      }

      const newRow = {};
      columns.forEach(col => newRow[col] = "");

      setData([...data, newRow]);
    } catch (error) {
      console.error("Error al añadir fila:", error);
      alert(`Error al añadir fila: ${error.message}`);
      fetchSheetData();
    }
  };

  const deleteRow = async (rowIndex) => {
    if (!window.confirm("¿Eliminar este registro permanentemente?")) return;
    try {
      const encodedNombre = encodeURIComponent(nombreHoja);
      await fetch(`${baseURL}/hoja/${encodedNombre}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowIndex: rowIndex + 1 })
      });
      fetchSheetData();
    } catch (error) {
      console.error("Error al eliminar fila:", error);
    }
  };

  const addNewColumn = async (columnName) => {
    try {
      const encodedNombre = encodeURIComponent(nombreHoja);
      const response = await fetch(`${baseURL}/hoja/${encodedNombre}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newColumn: columnName })
      });
      const result = await response.json();

      if (result.success) {
        setColumns([...columns, columnName]);
        setData(data.map(row => ({ ...row, [columnName]: "" })));
      }
    } catch (error) {
      console.error("Error al añadir columna:", error);
    }
  };

  const deleteColumn = async (colIndex) => {
    if (!window.confirm("¿Eliminar este parámetro y todos sus datos?")) return;

    try {
      const encodedNombre = encodeURIComponent(nombreHoja);
      const response = await fetch(`${baseURL}/hoja/${encodedNombre}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnIndex: colIndex })
      });
      const result = await response.json();

      if (result.success) {
        const newColumns = [...columns];
        const deletedColumnName = newColumns.splice(colIndex, 1)[0];
        setColumns(newColumns);
        setData(data.map(row => {
          const newRow = { ...row };
          delete newRow[deletedColumnName];
          return newRow;
        }));
      }
    } catch (error) {
      console.error("Error al eliminar columna:", error);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ marginTop: '140px' }}>
        <h2>Cargando hoja "{nombreHoja}"...</h2>
      </div>
    );
  }

  return (
    <>
      <FixedBar />
      <div className="container" style={{
        marginTop: '140px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start'
      }}>
        <ParametrosPanel
          columns={columns}
          onAddColumn={addNewColumn}
          onDeleteColumn={deleteColumn}
          position="left"
        />

        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h1 style={{ margin: 0 }}>Editando: {nombreHoja}</h1>
            <button
              className="btn btn-primary"
              onClick={addNewRow}
              style={{ padding: '0.5rem 1rem' }}
            >
              + Nuevo Registro
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              boxShadow: 'var(--shadow-md)'
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                  {columns.map((column, colIndex) => (
                    <th key={colIndex} style={{
                      padding: '0.75rem',
                      position: 'relative',
                      textAlign: 'left'
                    }}>
                      {column}
                      <button
                        onClick={() => deleteColumn(colIndex)}
                        style={{
                          position: 'absolute',
                          right: '0.25rem',
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                        title="Eliminar columna"
                      >
                        ×
                      </button>
                    </th>
                  ))}
                  <th style={{ padding: '0.75rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} style={{ padding: '0.75rem' }}>
                        <input
                          type="text"
                          value={row[column] || ''}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            backgroundColor: 'var(--color-card)'
                          }}
                        />
                      </td>
                    ))}
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        className="btn"
                        style={{
                          backgroundColor: 'var(--color-error)',
                          color: 'white',
                          padding: '0.25rem 0.5rem'
                        }}
                        onClick={() => deleteRow(rowIndex)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditarHoja;
