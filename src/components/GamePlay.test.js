import { act, fireEvent, render, screen } from '@testing-library/react';
import GamePlay from './GamePlay';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../context/GameContext', () => {
  const React = require('react');

  const questions = [
    { question: 'What is 2 + 2?', answer: '4' },
    { question: 'What is 3 + 4?', answer: '7' },
    { question: 'What is 5 - 3?', answer: '2' },
  ];

  let questionIndex = -1;

  return {
    __resetMockGame: () => {
      questionIndex = -1;
    },
    useGame: () => {
      const [currentQuestion, setCurrentQuestion] = React.useState(null);
      const [attempts, setAttempts] = React.useState(0);
      const [score, setScore] = React.useState(0);

      const generateQuestion = () => {
        questionIndex = Math.min(questionIndex + 1, questions.length - 1);
        const nextQuestion = questions[questionIndex];
        setCurrentQuestion(nextQuestion);
        return nextQuestion;
      };

      const generateAnswers = (correctAnswer) => [correctAnswer, '0', '9'];

      return {
        currentQuestion,
        generateQuestion,
        generateAnswers,
        setAttempts,
        attempts,
        setScore,
        score,
        currentLevel: 1,
      };
    },
  };
});

const { __resetMockGame } = jest.requireMock('../context/GameContext');

describe('GamePlay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockNavigate.mockReset();
    __resetMockGame();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test('resets attempts when advancing to the next question and still allows two tries', async () => {
    render(<GamePlay />);

    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByText('Attempts: 0/2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '0' }));
    expect(screen.getByText('Attempts: 1/2')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    fireEvent.click(screen.getByRole('button', { name: '4' }));
    expect(screen.getByText('Attempts: 2/2')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('What is 3 + 4?')).toBeInTheDocument();
    expect(screen.getByText('Attempts: 0/2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '0' }));
    expect(screen.getByText('Attempts: 1/2')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
