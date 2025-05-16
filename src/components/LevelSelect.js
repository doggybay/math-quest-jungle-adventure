import React from 'react';
import { useNavigate } from 'react-router-dom';

const LevelSelect = () => {
  const navigate = useNavigate();
  const totalLevels = 5;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-green-300 via-green-400 to-green-700 relative overflow-hidden">
      <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 drop-shadow-lg text-center tracking-wide mb-8 mt-8" style={{ WebkitTextStroke: '2px #3b2f13' }}>
        Choose a Level
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {Array.from({ length: totalLevels }, (_, i) => (
          <button
            key={i + 1}
            className="w-32 h-24 md:w-40 md:h-28 text-2xl md:text-3xl font-bold rounded-2xl bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white shadow-xl border-4 border-orange-600 transition flex items-center justify-center"
            onClick={() => navigate('/play')}
          >
            Lv {i + 1}
          </button>
        ))}
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