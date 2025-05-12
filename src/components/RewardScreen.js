import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RewardScreen.css';

const RewardScreen = () => {
  const navigate = useNavigate();
  const stars = 3; // This would come from game logic in a real implementation

  return (
    <div className="reward-container">
      <div className="reward-content">
        <h1>🎉 Well Done! 🎉</h1>
        
        <div className="stars-container">
          {Array.from({ length: stars }, (_, i) => (
            <span key={i} className="star">⭐</span>
          ))}
        </div>

        <p className="reward-message">You earned {stars} stars!</p>

        <div className="character-container">
          <span className="dancing-character">🐒</span>
        </div>

        <div className="button-container">
          <button 
            className="next-level-button"
            onClick={() => navigate('/levels')}
          >
            Next Level →
          </button>
          <button 
            className="try-again-button"
            onClick={() => navigate('/play')}
          >
            Try Again ↺
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardScreen; 