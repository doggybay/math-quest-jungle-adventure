import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { GameProvider, useGame } from './GameContext';

const STORAGE_KEY = 'jungle-adventure-progress-v1';

const ContextProbe = () => {
  const {
    levels,
    currentLevelConfig,
    levelProgress,
    bananas,
    completeCurrentLevel,
    selectLevel,
  } = useGame();

  return (
    <div>
      <div data-testid="levels">{JSON.stringify(levels)}</div>
      <div data-testid="current-level">{currentLevelConfig?.id}</div>
      <div data-testid="progress">{JSON.stringify(levelProgress)}</div>
      <div data-testid="bananas">{bananas}</div>
      <button
        onClick={() =>
          completeCurrentLevel({
            score: currentLevelConfig.questionCount,
            questionsAnswered: currentLevelConfig.questionCount,
            wrongQuestions: 0,
          })
        }
      >
        complete level
      </button>
      <button onClick={() => selectLevel(2)}>select level 2</button>
    </div>
  );
};

describe('GameProvider progression', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('unlocks the next level and restores persisted progress on reload', () => {
    const { unmount } = render(
      <GameProvider>
        <ContextProbe />
      </GameProvider>
    );

    expect(screen.getByTestId('current-level')).toHaveTextContent('1');
    expect(screen.getByTestId('levels').textContent).toContain('"isUnlocked":true');
    expect(screen.getByTestId('levels').textContent).toContain('"id":2');
    expect(screen.getByTestId('levels').textContent).toContain('"isUnlocked":false');

    act(() => {
      screen.getByRole('button', { name: /complete level/i }).click();
    });

    expect(screen.getByTestId('progress').textContent).toContain('"1":{"completed":true');
    expect(screen.getByTestId('progress').textContent).toContain('"bestStars":3');
    expect(screen.getByTestId('levels').textContent).toContain('"id":2');
    expect(screen.getByTestId('levels').textContent).toContain('"name":"Temple Steps"');
    expect(screen.getByTestId('levels').textContent).toContain('"topic":"Arithmetic"');
    expect(screen.getByTestId('levels').textContent).toContain('"questionCount":5');
    expect(screen.getByTestId('levels').textContent).toContain('"isUnlocked":true');
    expect(screen.getByTestId('bananas')).toHaveTextContent('15');

    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(persisted).toMatchObject({
      bananas: 15,
      unlockedLevel: 2,
      levelProgress: {
        '1': {
          bestStars: 3,
          completed: true,
        },
      },
    });

    unmount();

    render(
      <GameProvider>
        <ContextProbe />
      </GameProvider>
    );

    expect(screen.getByTestId('bananas')).toHaveTextContent('15');
    expect(screen.getByTestId('levels').textContent).toContain('"id":2');
    expect(screen.getByTestId('levels').textContent).toContain('"name":"Temple Steps"');
    expect(screen.getByTestId('levels').textContent).toContain('"isUnlocked":true');

    act(() => {
      screen.getByRole('button', { name: /select level 2/i }).click();
    });

    expect(screen.getByTestId('current-level')).toHaveTextContent('2');
  });
});
