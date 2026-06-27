import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LevelSelect from './LevelSelect';

const mockSelectLevel = jest.fn(() => true);

jest.mock('../context/GameContext', () => ({
  useGame: () => ({
    levels: [
      {
        id: 1,
        name: 'Canopy Trail',
        topic: 'Mixed Basics',
        questionCount: 4,
        encounters: [{}, {}, {}],
        isUnlocked: true,
        bestStars: 2,
        completed: true,
      },
      {
        id: 2,
        name: 'Temple Steps',
        topic: 'Arithmetic',
        questionCount: 5,
        encounters: [{}, {}, {}],
        isUnlocked: true,
        bestStars: 0,
        completed: false,
      },
      {
        id: 3,
        name: 'River Riddles',
        topic: 'Algebra',
        questionCount: 5,
        encounters: [{}, {}, {}],
        isUnlocked: false,
        bestStars: 0,
        completed: false,
      },
    ],
    selectLevel: mockSelectLevel,
    bananas: 25,
    totalStars: 2,
  }),
}));

describe('LevelSelect', () => {
  beforeEach(() => {
    mockSelectLevel.mockClear();
  });

  test('shows level status and prevents selecting locked levels', async () => {
    render(
      <MemoryRouter>
        <LevelSelect />
      </MemoryRouter>
    );

    expect(screen.getByText(/bananas: 25/i)).toBeInTheDocument();
    expect(screen.getByText(/stars: 2/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /level 1 canopy trail/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /level 2 temple steps/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /level 3 river riddles locked/i })).toBeDisabled();
    expect(screen.getByText(/completed · best 2★/i)).toBeInTheDocument();
    expect(screen.getByText(/ready to route/i)).toBeInTheDocument();
    expect(screen.getAllByText(/route: 3 encounters/i)).toHaveLength(3);

    await userEvent.click(screen.getByRole('button', { name: /level 2 temple steps/i }));

    expect(mockSelectLevel).toHaveBeenCalledWith(2);
  });
});
