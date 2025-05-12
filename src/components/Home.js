import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = React.useState(false);
  const [isMusicOn, setIsMusicOn] = React.useState(false);

  return (
    <div className="home-container">
      <div className="title-container">
        <h1>Math Quest: Jungle Adventure!</h1>
        <span className="character">🐵</span>
      </div>
      
      <div className="button-container">
        <button 
          className="adventure-button"
          onClick={() => navigate('/levels')}
        >
          Start Adventure
        </button>
        <button 
          className="practice-button"
          onClick={() => navigate('/levels')}
        >
          Practice Mode
        </button>
      </div>

      <div className="audio-controls">
        <button 
          className="audio-button"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        <button 
          className="music-button"
          onClick={() => setIsMusicOn(!isMusicOn)}
        >
          {isMusicOn ? '🎵' : '🎵'}
        </button>
      </div>
    </div>
  );
};

export default Home; 