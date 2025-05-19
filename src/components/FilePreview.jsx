// FilePreview.jsx
import '../styles/theme.css';
import { useNavigate } from 'react-router-dom';

const FilePreview = ({ fileName, fileNumber }) => {
  const navigate = useNavigate();
  const color = generateColorFromName(fileName);

  const handleClick = () => {
    navigate(`/editar/${fileName}`);
  };

  return (
    <div 
      className="card" 
      onClick={handleClick}
      style={{ 
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        transition: 'all 0.2s',
        cursor: 'pointer',
        ':hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
          borderColor: 'var(--color-primary)'
        }
      }}
    >
      <div style={{ marginRight: '1rem' }}>
        {generateSmallGraphic(color, fileNumber)}
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ 
          fontSize: '0.9rem', 
          fontWeight: '500',
          color: 'var(--color-text)',
          marginBottom: '0.25rem',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden'
        }}>
          {fileName}
        </div>
        <div style={{ 
          fontSize: '0.8rem', 
          color: 'var(--color-secondary)',
          opacity: 0.8
        }}>
          {fileNumber} {fileNumber === 1 ? 'registro' : 'registros'}
        </div>
      </div>
    </div>
  );
};

// Funciones auxiliares (mantener igual)
function generateColorFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

function generateSmallGraphic(color, number) {
  const size = 40;
  const radius = size / 2 - 4;
  const segments = Math.min(Math.max(number.toString().length, 3), 6);
  const angleStep = (Math.PI * 2) / segments;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="3" />
      {Array.from({ length: segments }).map((_, i) => {
        const angle = i * angleStep;
        const x1 = size/2 + Math.cos(angle) * radius * 0.7;
        const y1 = size/2 + Math.sin(angle) * radius * 0.7;
        const x2 = size/2 + Math.cos(angle) * radius;
        const y2 = size/2 + Math.sin(angle) * radius;
        
        return (
          <line 
            key={i}
            x1={x1} 
            y1={y1} 
            x2={x2} 
            y2={y2} 
            stroke={color} 
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}

export default FilePreview;