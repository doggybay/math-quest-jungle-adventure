import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GamePlay.css';

const GamePlay = () => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = React.useState(false);

  // Temporary sample question
  const question = "What is 3 + 2?";
  const answers = ["4", "5", "6"];

  const handleAnswer = (answer) => {
    // For now, just navigate to reward screen
    navigate('/reward');
  };

  return (
    <div className="gameplay-container">
      <div className="game-header">
        <span className="character">🦜</span>
        <div className="rewards">
          <span>🍌 x 3</span>
        </div>
        <button 
          className="pause-button"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? '▶' : '⏸'}
        </button>
      </div>

      <div className="question-box">
        <h2>{question}</h2>
      </div>

      <div className="answers-container">
        {answers.map((answer, index) => (
          <button
            key={index}
            className="answer-button"
            onClick={() => handleAnswer(answer)}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GamePlay; 