import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const RewardScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, success, goalQuestions } = location.state || {};
  const { levels, selectLevel } = useGame();

  if (!result) {
    navigate('/levels');
    return null;
  }

  const nextLevel = levels.find((level) => level.id === result.nextLevelId);
  const canAdvance = success && nextLevel && nextLevel.isUnlocked && nextLevel.id !== result.levelId;

  const handleNextAction = () => {
    if (canAdvance) {
      selectLevel(nextLevel.id, { mode: 'adventure' });
      navigate('/map');
      return;
    }

    navigate('/levels');
  };

  const handleRetry = () => {
    selectLevel(result.levelId, { mode: 'adventure' });
    navigate('/map');
  };

  return (
    <main
      id="main-content"
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-green-300 via-green-400 to-green-700 relative overflow-hidden px-2 py-4"
    >
      <div className="w-full max-w-xl bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 flex flex-col items-center border-4 border-green-700">
        <h1
          className={`text-3xl md:text-4xl font-extrabold text-center mb-4 ${success ? 'text-yellow-400' : 'text-red-400'} drop-shadow-lg`}
          style={{ WebkitTextStroke: '2px #3b2f13' }}
        >
          {success ? '🏆 Level Cleared! 🏆' : '💥 Adventure Paused 💥'}
        </h1>
        <h2 className="text-2xl font-extrabold text-green-950 text-center mb-2">{result.levelName}</h2>
        <p className="text-lg font-semibold text-green-900 text-center mb-4">
          {success
            ? `You answered ${result.score}/${goalQuestions} questions and earned your path forward.`
            : `You missed ${result.wrongQuestions} questions. Regroup and try the level again.`}
        </p>

        <div className="flex gap-2 mb-4">
          {Array.from({ length: 3 }, (_, index) => (
            <span
              key={index}
              className={`text-5xl ${index < result.starsEarned ? 'text-yellow-400 drop-shadow' : 'text-gray-300'}`}
            >
              ⭐
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mb-6 text-center text-green-950 font-bold">
          <div className="rounded-xl bg-yellow-100 border-2 border-yellow-400 px-4 py-3 shadow">
            Bananas<br />+{result.bananasEarned}
          </div>
          <div className="rounded-xl bg-green-100 border-2 border-green-400 px-4 py-3 shadow">
            Score<br />{result.score}
          </div>
          <div className="rounded-xl bg-white border-2 border-green-600 px-4 py-3 shadow">
            Wrong Questions<br />{result.wrongQuestions}
          </div>
        </div>

        <div className="mb-6">
          <span className={`text-[6rem] md:text-[7rem] select-none ${success ? 'animate-bounce' : 'opacity-70'}`}>
            {success ? '🐒' : '🧭'}
          </span>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {success ? (
            <button
              className="w-full py-4 text-2xl font-bold rounded-xl bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white shadow-xl border-4 border-orange-600 transition"
              onClick={handleNextAction}
            >
              {canAdvance ? `Play Level ${nextLevel.id} →` : 'Back to Levels'}
            </button>
          ) : (
            <button
              className="w-full py-4 text-2xl font-bold rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-xl border-4 border-green-700 transition"
              onClick={handleRetry}
            >
              Try Again ↺
            </button>
          )}
          <button
            className="w-full py-4 text-xl font-bold rounded-xl bg-white hover:bg-green-50 active:bg-green-100 text-green-900 shadow border-4 border-green-700 transition"
            onClick={() => navigate('/levels')}
          >
            Return to Level Select
          </button>
        </div>
      </div>
    </main>
  );
};

export default RewardScreen;
