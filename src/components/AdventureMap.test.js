import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdventureMap from './AdventureMap';

const mockNavigate = jest.fn();
const mockStartAdventure = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../context/GameContext', () => ({
  useGame: () => ({
    adventure: {
      levelId: 1,
      totalQuestionGoal: 4,
      totalQuestionsAnswered: 2,
      totalWrongQuestions: 1,
      completedEncounters: 1,
      currentEncounterIndex: 1,
      nodes: [
        {
          id: '1-bridge-1',
          sequence: 1,
          title: 'Vine Bridge',
          shortLabel: 'Bridge',
          icon: '🌉',
          description: 'Cross the bridge.',
          questionCount: 2,
        },
        {
          id: '1-rescue-2',
          sequence: 2,
          title: 'Monkey Rescue',
          shortLabel: 'Rescue',
          icon: '🐒',
          description: 'Help the scouts.',
          questionCount: 1,
        },
        {
          id: '1-gate-3',
          sequence: 3,
          title: 'Temple Gate',
          shortLabel: 'Gate',
          icon: '🛕',
          description: 'Open the gate.',
          questionCount: 1,
        },
      ],
    },
    currentEncounter: {
      id: '1-rescue-2',
      sequence: 2,
      title: 'Monkey Rescue',
      shortLabel: 'Rescue',
      icon: '🐒',
      description: 'Help the scouts.',
      questionCount: 1,
    },
    currentLevelConfig: {
      id: 1,
      name: 'Canopy Trail',
    },
    score: 2,
    startAdventure: mockStartAdventure,
  }),
}));

describe('AdventureMap', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockStartAdventure.mockReset();
  });

  test('renders encounter progress and enters the active route', async () => {
    render(
      <MemoryRouter>
        <AdventureMap />
      </MemoryRouter>
    );

    expect(screen.getByText(/canopy trail/i)).toBeInTheDocument();
    expect(screen.getByText(/encounters/i)).toBeInTheDocument();
    expect(screen.getByText(/cleared/i)).toBeInTheDocument();
    expect(screen.getByText(/current route/i)).toBeInTheDocument();
    expect(screen.getByText(/locked until prior encounter clears/i)).toBeInTheDocument();
    expect(screen.getByText(/up next/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enter rescue/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /enter rescue/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/play');
  });
});
