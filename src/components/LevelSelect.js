import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LevelSelect.css';

const LevelSelect = () => {
  const navigate = useNavigate();
  const totalLevels = 5;

  return (
    <div className="level-select-container">
      <h1>Choose a Level</h1>
      
      <div className="levels-grid">
        {Array.from({ length: totalLevels }, (_, i) => (
          <button
            key={i + 1}
            className="level-button"
            onClick={() => navigate('/play')}
          >
            Lv {i + 1}
          </button>
        ))}
      </div>

      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
    </div>
  );
};

export default LevelSelect; 