import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const GamePlay = () => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [, setWrongQuestionsCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  const {
    currentQuestion,
    generateQuestion,
    generateAnswers,
    setAttempts,
    attempts,
    setScore,
    score,
    currentLevel
  } = useGame();

  useEffect(() => {
    if (!currentQuestion) {
      const question = generateQuestion();
      setAnswers(generateAnswers(question.answer));
    }
  }, [currentLevel, currentQuestion, generateQuestion, generateAnswers]);

  const loadNextQuestion = () => {
    const nextQuestion = generateQuestion();
    setAnswers(generateAnswers(nextQuestion.answer));
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setAttempts(0);
  };

  const handleAnswer = (answer) => {
    const nextAttemptCount = attempts + 1;

    setSelectedAnswer(answer);
    setShowFeedback(true);
    setAttempts(nextAttemptCount);

    if (answer === currentQuestion.answer) {
      setIsCorrect(true);
      setScore(score + 1);
      setTimeout(() => {
        loadNextQuestion();
      }, 1000);
      return;
    }

    if (nextAttemptCount < 2) {
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1000);
      return;
    }

    setWrongQuestionsCount((count) => {
      const nextWrongQuestionsCount = count + 1;

      setTimeout(() => {
        if (nextWrongQuestionsCount >= 3) {
          navigate('/levels');
          return;
        }

        loadNextQuestion();
      }, 1000);

      return nextWrongQuestionsCount;
    });
  };

  if (!currentQuestion) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-300 via-green-400 to-green-700 text-2xl font-bold text-yellow-100">Loading question...</div>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-green-300 via-green-400 to-green-700 relative overflow-hidden px-2 py-4">
      <div className="flex items-center justify-between w-full max-w-2xl mb-6 px-2">
        <span className="text-4xl md:text-5xl select-none">🦜</span>
        <div className="flex items-center gap-2 bg-yellow-200 bg-opacity-80 rounded-xl px-4 py-2 shadow border-2 border-yellow-400">
          <span className="text-lg font-bold text-yellow-900">🍌 x {score}</span>
        </div>
        <button
          className="bg-green-800 bg-opacity-60 rounded-full p-3 shadow-lg hover:bg-green-700 transition text-white text-2xl"
          onClick={() => setIsPaused(!isPaused)}
          aria-label="Pause"
        >
          {isPaused ? '▶' : '⏸'}
        </button>
      </div>

      <div className="w-full max-w-2xl bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 mb-8 flex flex-col items-center border-4 border-green-700">
        <h2 className="text-2xl md:text-3xl font-bold text-green-900 text-center mb-2 drop-shadow">{currentQuestion.question}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-8">
        {answers.map((answer, index) => (
          <button
            key={index}
            className={`w-full py-5 text-2xl font-bold rounded-xl border-4 transition shadow-xl
              ${showFeedback
                ? isCorrect && answer === currentQuestion.answer
                  ? 'bg-green-400 border-green-700 text-white scale-105'
                  : selectedAnswer === answer && answer !== currentQuestion.answer
                  ? 'bg-red-400 border-red-700 text-white shake'
                  : 'bg-white border-green-300 text-green-900'
                : 'bg-white border-green-300 text-green-900 hover:bg-green-200 hover:scale-105 active:bg-green-300'}
            `}
            onClick={() => handleAnswer(answer)}
            disabled={showFeedback}
          >
            {answer}
            {showFeedback && isCorrect && answer === currentQuestion.answer && ' 🟩'}
            {showFeedback && selectedAnswer === answer && answer !== currentQuestion.answer && ' ❌'}
          </button>
        ))}
      </div>

      <div className="text-lg font-bold text-white bg-green-800 bg-opacity-70 rounded-xl px-6 py-2 shadow border-2 border-green-900">
        Attempts: {attempts}/2
      </div>
    </div>
  );
};

export default GamePlay;
