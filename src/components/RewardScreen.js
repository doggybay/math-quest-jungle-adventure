import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import './RewardScreen.css';

const RewardScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { correct, attempts } = location.state || { correct: false, attempts: 0 };
  const { setTotalStars, totalStars, currentLevel, setCurrentLevel } = useGame();

  const getStars = () => {
    if (!correct) return 0;
    if (attempts === 0) return 3;
    if (attempts === 1) return 2;
    return 1;
  };

  const stars = getStars();

  useEffect(() => {
    setTotalStars(totalStars + stars);
  }, []);

  const handleNextLevel = () => {
    setCurrentLevel(currentLevel + 1);
    navigate('/levels');
  };

  const handleTryAgain = () => {
    navigate('/play');
  };

  return (
    <div className="reward-container">
      <div className="reward-content">
        <h1>
          {correct ? '🎉 Well Done! 🎉' : '💪 Keep Trying! 💪'}
        </h1>
        
        <div className="stars-container">
          {Array.from({ length: 3 }, (_, i) => (
            <span 
              key={i} 
              className={`star ${i < stars ? 'earned' : ''}`}
            >
              ⭐
            </span>
          ))}
        </div>

        <p className="reward-message">
          {correct 
            ? `You earned ${stars} stars!`
            : 'Don\'t give up! Try again!'}
        </p>

        <div className="character-container">
          <span className={`dancing-character ${correct ? 'dance' : 'sad'}`}>
            {correct ? '🐒' : '😢'}
          </span>
        </div>

        <div className="button-container">
          {correct ? (
            <button 
              className="next-level-button"
              onClick={handleNextLevel}
            >
              Next Level →
            </button>
          ) : (
            <button 
              className="try-again-button"
              onClick={handleTryAgain}
            >
              Try Again ↺
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardScreen; 