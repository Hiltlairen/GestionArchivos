import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import FixedBar from '../components/FixedBar';
import FilePreview from '../components/FilePreview';
import SearchResults from '../components/SearchResults';

const Inicio = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const baseURL = "http://192.168.1.6:5000"; // IP del backend

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log("Conectando a:", `${baseURL}/hojas`);
        const response = await fetch(`${baseURL}/hojas`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Archivos recibidos:", data);
        if (Array.isArray(data)) {
          setFiles(data.filter(f => f && f.fileName)); // Validación extra
        } else {
          throw new Error("La respuesta del servidor no es un arreglo");
        }
      } catch (error) {
        console.error("Error al cargar hojas:", error);
        setError("Error al cargar las hojas. Mostrando datos de ejemplo...");
        setFiles([
          { fileName: "Contrato de arrendamiento", fileNumber: "1253" },
          { fileName: "Escritura pública", fileNumber: "4587" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleSearch = async ({ term, sheet, column }) => {
    if (!term.trim()) {
      alert("Por favor ingresa un término de búsqueda");
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);

      const params = new URLSearchParams({
        hoja: sheet,
        valor: term
      });

      if (column) {
        params.append('columna', column);
      }

      const response = await fetch(`${baseURL}/buscar?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data);
      } else {
        throw new Error(data.error || "Error en la búsqueda");
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFileClick = (fileName) => {
    navigate(`/editar/${encodeURIComponent(fileName)}`);
  };

  const handleBackFromSearch = () => {
    setSearchResults(null);
  };

  if (loading) {
    return <div className="loading">Cargando archivos...</div>;
  }

  return (
    <>
      <FixedBar 
        onSearch={handleSearch} 
        sheets={Array.isArray(files) ? files : []}
        isLoading={searchLoading}
      />
      
      <div className="container" style={{ marginTop: '140px' }}>
        {error && <div className="error-message">{error}</div>}

        {searchResults ? (
          <SearchResults 
            results={searchResults} 
            onBack={handleBackFromSearch}
          />
        ) : (
          <>
            <h1>¡Bienvenido a URT (Unidad de Registro Territorial)!</h1>
            <h2>Busca y administra documentos fácilmente por clase, nombre o número de libreta.</h2>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
              width: '100%',
              maxWidth: '1200px',
              marginTop: '2rem'
            }}>
              {files.map((file, index) => (
                <div key={index} onClick={() => handleFileClick(file.fileName)}>
                  <FilePreview 
                    fileName={file.fileName || "Sin nombre"}
                    fileNumber={file.fileNumber || "N/A"}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Inicio;
