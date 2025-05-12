import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LevelSelect from './components/LevelSelect';
import GamePlay from './components/GamePlay';
import RewardScreen from './components/RewardScreen';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/play" element={<GamePlay />} />
        <Route path="/reward" element={<RewardScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
