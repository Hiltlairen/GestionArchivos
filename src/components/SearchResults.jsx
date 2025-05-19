import React from 'react';
import '../styles/search-results.css';

const SearchResults = ({ results, onBack }) => {
    if (!results || !results.resultados || results.resultados.length === 0) {
        return (
            <div className="search-results">
                <button onClick={onBack} className="back-btn">
                    ← Volver a la vista principal
                </button>
                <div className="no-results">
                    No se encontraron resultados para la búsqueda.
                </div>
            </div>
        );
    }

    return (
        <div className="search-results">
            <button onClick={onBack} className="back-btn">
                ← Volver a la vista principal
            </button>
            
            <h2 className="results-title">
                Resultados en "{results.hoja}" ({results.total} encontrados)
            </h2>
            
            <div className="table-container">
                <table className="results-table">
                    <thead>
                        <tr>
                            {Object.keys(results.resultados[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.resultados.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, i) => (
                                    <td key={i}>{value || <span className="empty-value">(vacío)</span>}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SearchResults;