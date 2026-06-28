import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Home from './components/Home';
import LevelSelect from './components/LevelSelect';
import AdventureMap from './components/AdventureMap';
import GamePlay from './components/GamePlay';
import RewardScreen from './components/RewardScreen';
import './App.css';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/levels" element={<LevelSelect />} />
          <Route path="/map" element={<AdventureMap />} />
          <Route path="/play" element={<GamePlay />} />
          <Route path="/reward" element={<RewardScreen />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
