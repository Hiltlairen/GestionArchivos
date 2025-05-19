import React, { useState } from 'react';
import '../styles/fixedbar.css';

const FixedBar = ({ onSearch, sheets = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSheet, setSelectedSheet] = useState('');
    const [selectedColumn, setSelectedColumn] = useState('');
    const [columns, setColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadColumns = async (sheetName) => {
        if (!sheetName) {
            setColumns([]);
            return;
        }
        
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:5000/hoja/${sheetName}`);
            const data = await response.json();
            setColumns(data.columns || []);
        } catch (error) {
            console.error("Error cargando columnas:", error);
            setColumns([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        if (!selectedSheet) {
            alert("Por favor selecciona una hoja donde buscar");
            return;
        }
        onSearch({
            term: searchTerm,
            sheet: selectedSheet,
            column: selectedColumn
        });
    };

    return (
        <div className="fixed-bar">
          <div className="logo-container">
        <Link to="/" className="logo-link">
          <span className="logo">URT</span>
          <span className="logo-text">Unidad de Registro Territorial</span>
        </Link>
      </div>
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Buscar documentos..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                
                {/* Selector de hoja */}
                <select 
                    className="search-filter"
                    value={selectedSheet}
                    onChange={(e) => {
                        setSelectedSheet(e.target.value);
                        loadColumns(e.target.value);
                        setSelectedColumn('');
                    }}
                    disabled={isLoading}
                >
                    <option value="">Selecciona hoja ▼</option>
                    {Array.isArray(sheets) && sheets.map((sheet) => (
                        <option key={sheet.fileName} value={sheet.fileName}>
                            {sheet.fileName} ({sheet.fileNumber} reg.)
                        </option>
                    ))}
                </select>
                
                {/* Selector de columna */}
                {selectedSheet && (
                    <select
                        className="search-filter"
                        value={selectedColumn}
                        onChange={(e) => setSelectedColumn(e.target.value)}
                        disabled={isLoading || !columns.length}
                    >
                        <option value="">Todas las columnas ▼</option>
                        {columns.map((col) => (
                            <option key={col} value={col}>
                                {col}
                            </option>
                        ))}
                    </select>
                )}
                
                <button 
                    className="search-btn"
                    onClick={handleSearch}
                    disabled={isLoading || !selectedSheet}
                >
                    {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>
        </div>
    );
};

export default FixedBar;
