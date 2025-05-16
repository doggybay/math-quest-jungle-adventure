import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = React.useState(false);
  const [isMusicOn, setIsMusicOn] = React.useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-green-300 via-green-400 to-green-700 relative overflow-hidden">
      {/* Jungle leaves or background SVG could go here for more detail */}
      <div className="absolute left-4 bottom-4">
        <button
          className="bg-green-800 bg-opacity-60 rounded-full p-3 shadow-lg hover:bg-green-700 transition"
          onClick={() => setIsMusicOn(!isMusicOn)}
          aria-label="Toggle music"
        >
          <span className="text-2xl">{isMusicOn ? '🎵' : '🎵'}</span>
        </button>
      </div>
      <div className="absolute right-4 bottom-4">
        <button
          className="bg-green-800 bg-opacity-60 rounded-full p-3 shadow-lg hover:bg-green-700 transition"
          onClick={() => setIsMuted(!isMuted)}
          aria-label="Toggle sound"
        >
          <span className="text-2xl">{isMuted ? '🔇' : '🔊'}</span>
        </button>
      </div>
      <div className="flex flex-col items-center mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400 drop-shadow-lg text-center tracking-wide mb-2" style={{ WebkitTextStroke: '2px #3b2f13' }}>
          MATH QUEST
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow text-center mb-4">
          Jungle Adventure!
        </h2>
        <span className="text-[7rem] md:text-[8rem] mb-2 select-none">🐵</span>
      </div>
      <div className="flex flex-col gap-6 w-full max-w-xs mt-2">
        <button
          className="w-full py-5 text-2xl font-bold rounded-xl bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white shadow-xl border-4 border-orange-600 transition"
          onClick={() => navigate('/levels')}
        >
          Start Adventure
        </button>
        <button
          className="w-full py-5 text-2xl font-bold rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-xl border-4 border-green-700 transition"
          onClick={() => navigate('/levels')}
        >
          Practice Mode
        </button>
      </div>
    </div>
  );
};

export default Home; 