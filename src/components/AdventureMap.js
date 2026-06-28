import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const AdventureMap = () => {
  const navigate = useNavigate();
  const { adventure, currentEncounter, currentLevelConfig, score, startAdventure } = useGame();

  useEffect(() => {
    if (!currentLevelConfig) {
      navigate('/levels');
      return;
    }

    if (!adventure || adventure.levelId !== currentLevelConfig.id) {
      startAdventure();
    }
  }, [adventure, currentLevelConfig, navigate, startAdventure]);

  if (!adventure || !currentEncounter) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-300 via-green-400 to-green-700 text-2xl font-bold text-yellow-100">
        Building your jungle route...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-green-300 via-green-400 to-green-700 relative overflow-hidden px-4 py-8">
      <div className="w-full max-w-5xl bg-white/90 rounded-3xl border-4 border-green-700 shadow-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-4xl md:text-5xl font-extrabold text-yellow-300 drop-shadow-lg tracking-wide"
              style={{ WebkitTextStroke: '2px #3b2f13' }}
            >
              {currentLevelConfig.name}
            </h1>
            <p className="text-lg md:text-xl font-bold text-green-950 mt-2">
              Follow the jungle route encounter by encounter instead of one flat quiz sprint.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm md:text-base font-bold text-green-950 min-w-fit">
            <div className="rounded-xl bg-yellow-100 border-2 border-yellow-400 px-4 py-3 shadow">
              Bananas in run<br />{score}
            </div>
            <div className="rounded-xl bg-white border-2 border-green-600 px-4 py-3 shadow">
              Encounters<br />{adventure.completedEncounters}/{adventure.nodes.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-green-950 font-bold">
          <div className="rounded-2xl bg-green-50 border-2 border-green-500 px-4 py-4 shadow">
            Level goal: {adventure.totalQuestionGoal} questions
          </div>
          <div className="rounded-2xl bg-green-50 border-2 border-green-500 px-4 py-4 shadow">
            Solved so far: {adventure.totalQuestionsAnswered}
          </div>
          <div className="rounded-2xl bg-green-50 border-2 border-green-500 px-4 py-4 shadow">
            Missed so far: {adventure.totalWrongQuestions}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {adventure.nodes.map((node, index) => {
            const isCompleted = index < adventure.currentEncounterIndex;
            const isActive = index === adventure.currentEncounterIndex;

            return (
              <div
                key={node.id}
                className={`rounded-2xl border-4 p-5 shadow-xl ${
                  isActive
                    ? 'bg-orange-200 border-orange-600'
                    : isCompleted
                    ? 'bg-green-100 border-green-600'
                    : 'bg-green-900/70 border-green-950 text-green-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-sm font-extrabold uppercase tracking-wide opacity-80">
                      Encounter {node.sequence}
                    </div>
                    <div className="text-2xl font-extrabold">{node.title}</div>
                  </div>
                  <div className="text-4xl select-none">{node.icon}</div>
                </div>

                <p className="text-sm md:text-base font-semibold mb-4">{node.description}</p>
                <div className="text-sm md:text-base font-bold mb-4">
                  Goal: {node.questionCount} question{node.questionCount === 1 ? '' : 's'}
                </div>
                <div className="text-sm md:text-base font-bold">
                  {isCompleted ? 'Cleared' : isActive ? 'Current route' : 'Locked until prior encounter clears'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl bg-white border-2 border-green-600 shadow px-5 py-5 mb-6 text-green-950">
          <div className="text-sm uppercase tracking-wide font-extrabold opacity-70 mb-1">Up next</div>
          <div className="text-2xl font-extrabold mb-2">
            {currentEncounter.icon} {currentEncounter.title}
          </div>
          <div className="text-base font-semibold mb-2">{currentEncounter.description}</div>
          <div className="text-base font-bold">
            Solve {currentEncounter.questionCount} question{currentEncounter.questionCount === 1 ? '' : 's'} to clear this stop.
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            className="flex-1 py-4 text-2xl font-bold rounded-xl bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white shadow-xl border-4 border-orange-600 transition"
            onClick={() => navigate('/play')}
          >
            Enter {currentEncounter.shortLabel} →
          </button>
          <button
            className="flex-1 py-4 text-xl font-bold rounded-xl bg-white hover:bg-green-50 active:bg-green-100 text-green-900 shadow border-4 border-green-700 transition"
            onClick={() => navigate('/levels')}
          >
            Back to Level Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdventureMap;
