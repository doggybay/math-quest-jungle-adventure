import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';

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
  }, [setTotalStars, totalStars, stars]);

  const handleNextLevel = () => {
    setCurrentLevel(currentLevel + 1);
    navigate('/levels');
  };

  const handleTryAgain = () => {
    navigate('/play');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-green-300 via-green-400 to-green-700 relative overflow-hidden px-2 py-4">
      <div className="w-full max-w-lg bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 flex flex-col items-center border-4 border-green-700">
        <h1 className={`text-3xl md:text-4xl font-extrabold text-center mb-4 ${correct ? 'text-yellow-400' : 'text-red-400'} drop-shadow-lg`} style={{ WebkitTextStroke: '2px #3b2f13' }}>
          {correct ? '🎉 Well Done! 🎉' : '💪 Keep Trying! 💪'}
        </h1>
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 3 }, (_, i) => (
            <span
              key={i}
              className={`text-5xl ${i < stars ? 'text-yellow-400 drop-shadow' : 'text-gray-300'}`}
            >
              ⭐
            </span>
          ))}
        </div>
        <p className="text-xl font-bold text-green-900 text-center mb-4">
          {correct
            ? `You earned ${stars} star${stars === 1 ? '' : 's'}!`
            : "Don't give up! Try again!"}
        </p>
        <div className="mb-6">
          <span className={`text-[6rem] md:text-[7rem] select-none ${correct ? 'animate-bounce' : 'opacity-70'}`}>
            {correct ? '🐒' : '😢'}
          </span>
        </div>
        <div className="flex flex-col gap-4 w-full">
          {correct ? (
            <button
              className="w-full py-4 text-2xl font-bold rounded-xl bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white shadow-xl border-4 border-orange-600 transition"
              onClick={handleNextLevel}
            >
              Next Level →
            </button>
          ) : (
            <button
              className="w-full py-4 text-2xl font-bold rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-xl border-4 border-green-700 transition"
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