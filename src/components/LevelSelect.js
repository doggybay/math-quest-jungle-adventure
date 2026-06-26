import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const LevelSelect = () => {
  const navigate = useNavigate();
  const { levels, selectLevel, bananas, totalStars } = useGame();

  const handleLevelClick = (levelId) => {
    const wasSelected = selectLevel(levelId);
    if (wasSelected) {
      navigate('/play');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-green-300 via-green-400 to-green-700 relative overflow-hidden px-4 py-10">
      <h1
        className="text-4xl md:text-5xl font-extrabold text-yellow-300 drop-shadow-lg text-center tracking-wide mb-4"
        style={{ WebkitTextStroke: '2px #3b2f13' }}
      >
        Choose a Level
      </h1>
      <p className="text-lg md:text-xl font-bold text-white mb-6 text-center max-w-2xl">
        Adventure progress is now real: clear levels, bank bananas, and unlock the deeper jungle.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm md:text-base font-bold text-green-950">
        <div className="rounded-full bg-yellow-200 px-4 py-2 border-2 border-yellow-500 shadow">
          Bananas: {bananas}
        </div>
        <div className="rounded-full bg-white px-4 py-2 border-2 border-green-600 shadow">
          Stars: {totalStars}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl mb-10">
        {levels.map((level) => {
          const statusLabel = level.completed
            ? `Completed · Best ${level.bestStars}★`
            : level.isUnlocked
            ? 'Ready to play'
            : 'Locked';

          return (
            <button
              key={level.id}
              className={`w-full min-h-40 rounded-2xl text-left p-5 border-4 shadow-xl transition ${
                level.isUnlocked
                  ? 'bg-orange-300 hover:bg-orange-200 active:bg-orange-300 border-orange-700 text-green-950'
                  : 'bg-green-900/70 border-green-950 text-green-100 opacity-70 cursor-not-allowed'
              }`}
              onClick={() => handleLevelClick(level.id)}
              disabled={!level.isUnlocked}
              aria-label={`Level ${level.id} ${level.name}${level.isUnlocked ? '' : ' locked'}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="text-xl md:text-2xl font-extrabold">Level {level.id}</div>
                  <div className="text-2xl font-extrabold">{level.name}</div>
                </div>
                <span className="text-4xl select-none">
                  {level.completed ? '🏆' : level.isUnlocked ? '🗺️' : '🔒'}
                </span>
              </div>
              <div className="text-sm md:text-base font-semibold mb-2">
                Topic: {level.topic}
              </div>
              <div className="text-sm md:text-base font-semibold mb-4">
                Goal: {level.questionCount} questions
              </div>
              <div className="text-sm md:text-base font-bold">{statusLabel}</div>
            </button>
          );
        })}
      </div>

      <button
        className="px-8 py-3 text-xl font-bold rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-lg border-4 border-green-700 transition flex items-center gap-2"
        onClick={() => navigate('/')}
      >
        <span className="text-2xl">←</span> Back
      </button>
    </div>
  );
};

export default LevelSelect;
