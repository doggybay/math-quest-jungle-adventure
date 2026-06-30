import React from 'react';
import { useNavigate } from 'react-router-dom';
import menuArt from '../assets/home-bg.png';
import { LEVEL_DEFINITIONS } from '../data/levels';

const totalEncounters = LEVEL_DEFINITIONS.reduce((sum, level) => sum + level.encounters.length, 0);

const Home = () => {
  const navigate = useNavigate();

  return (
    <main
      id="main-content"
      className="relative isolate min-h-screen overflow-hidden bg-[#14532d] px-4 py-8 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.55),_transparent_38%),radial-gradient(circle_at_bottom,_rgba(251,191,36,0.28),_transparent_24%),linear-gradient(180deg,_#86efac_0%,_#22c55e_42%,_#15803d_100%)]" />
      <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-green-900/25 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-yellow-500/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="order-2 flex flex-col items-start justify-center lg:order-1">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-200/60 bg-white/15 px-4 py-2 text-sm font-extrabold uppercase tracking-[0.2em] text-yellow-100 shadow-lg backdrop-blur-sm">
            Jungle math adventure
          </span>

          <div className="max-w-2xl rounded-[2rem] border-4 border-green-950/35 bg-green-950/20 p-6 shadow-2xl backdrop-blur-[2px] md:p-8">
            <h1
              className="text-5xl font-black uppercase tracking-wide text-yellow-300 drop-shadow-[0_4px_0_rgba(59,47,19,0.9)] md:text-7xl"
              style={{ WebkitTextStroke: '2px #4a3516' }}
            >
              Math Quest
            </h1>
            <h2
              className="mt-2 text-3xl font-black text-white drop-shadow-[0_3px_0_rgba(87,46,14,0.65)] md:text-5xl"
              style={{ WebkitTextStroke: '1px #5b3415' }}
            >
              Jungle Adventure!
            </h2>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-green-50 md:text-xl">
              Travel deeper into the jungle by clearing short math encounters, unlocking new paths,
              and collecting stars and bananas as you go.
            </p>

            <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border-2 border-yellow-300/70 bg-yellow-200/90 px-4 py-3 text-green-950 shadow-lg">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-green-900/70">Levels</div>
                <div className="mt-1 text-2xl font-black">{LEVEL_DEFINITIONS.length}</div>
              </div>
              <div className="rounded-2xl border-2 border-green-300/70 bg-white/90 px-4 py-3 text-green-950 shadow-lg">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-green-900/70">Encounters</div>
                <div className="mt-1 text-2xl font-black">{totalEncounters}</div>
              </div>
              <div className="rounded-2xl border-2 border-green-300/70 bg-white/90 px-4 py-3 text-green-950 shadow-lg">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-green-900/70">Progress</div>
                <div className="mt-1 text-lg font-black">Auto-saves</div>
              </div>
            </div>

            <div className="mt-8 flex w-full flex-col gap-4 md:max-w-md">
              <button
                className="group w-full rounded-[1.75rem] border-4 border-orange-700 bg-gradient-to-b from-orange-300 to-orange-500 px-6 py-5 text-left text-white shadow-[0_12px_30px_rgba(120,53,15,0.35)] transition hover:-translate-y-1 hover:from-orange-200 hover:to-orange-400 active:translate-y-0"
                onClick={() => navigate('/levels')}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-2xl font-black md:text-3xl">Start Adventure</div>
                    <div className="mt-1 text-sm font-bold text-orange-50/95 md:text-base">
                      Follow the guided jungle route and unlock new ruins.
                    </div>
                  </div>
                  <span className="text-3xl transition group-hover:translate-x-1">→</span>
                </div>
              </button>

              <button
                className="w-full rounded-[1.5rem] border-4 border-green-800 bg-white/92 px-6 py-4 text-left text-green-950 shadow-xl transition hover:-translate-y-1 hover:bg-green-50 active:translate-y-0"
                onClick={() => navigate('/levels')}
              >
                <div className="text-xl font-black md:text-2xl">Choose a Level</div>
                <div className="mt-1 text-sm font-bold text-green-900/80 md:text-base">
                  Jump into any unlocked jungle route from the level board.
                </div>
              </button>
            </div>

            <p className="mt-5 text-sm font-bold text-green-50/90 md:text-base">
              Best on a big screen, but readable on tablets too. Your level progress saves automatically.
            </p>
          </div>
        </section>

        <aside className="order-1 flex flex-col gap-4 lg:order-2">
          <div className="overflow-hidden rounded-[2rem] border-4 border-green-950/35 bg-white/15 shadow-2xl backdrop-blur-sm">
            <img
              src={menuArt}
              alt="Math Quest Jungle Adventure concept art showing the playful jungle menu and monkey mascot"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-2xl border-2 border-green-900/35 bg-white/88 px-4 py-4 text-green-950 shadow-lg">
              <div className="text-sm font-black uppercase tracking-[0.18em] text-green-900/70">Route play</div>
              <p className="mt-2 text-sm font-bold leading-6">
                Each level is broken into short adventure stops instead of one long quiz wall.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-green-900/35 bg-white/88 px-4 py-4 text-green-950 shadow-lg">
              <div className="text-sm font-black uppercase tracking-[0.18em] text-green-900/70">Kid-friendly</div>
              <p className="mt-2 text-sm font-bold leading-6">
                Big tap targets, bright contrast, and quick rounds keep the flow readable and low-friction.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-green-900/35 bg-white/88 px-4 py-4 text-green-950 shadow-lg">
              <div className="text-sm font-black uppercase tracking-[0.18em] text-green-900/70">Rewards</div>
              <p className="mt-2 text-sm font-bold leading-6">
                Collect bananas and stars as you clear jungle encounters and unlock deeper paths.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Home;
