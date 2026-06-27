import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const MAX_ATTEMPTS_PER_QUESTION = 2;
const MAX_WRONG_QUESTIONS = 3;

const GamePlay = () => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [wrongQuestionsCount, setWrongQuestionsCount] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  const {
    attempts,
    completeCurrentLevel,
    currentLevelConfig,
    currentQuestion,
    generateAnswers,
    generateQuestion,
    score,
    setAttempts,
    setScore,
  } = useGame();

  const questionsRemaining = useMemo(
    () => Math.max(currentLevelConfig.questionCount - questionsAnswered, 0),
    [currentLevelConfig.questionCount, questionsAnswered]
  );

  useEffect(() => {
    setScore(0);
    setAttempts(0);
    setWrongQuestionsCount(0);
    setQuestionsAnswered(0);
  }, [currentLevelConfig.id, setAttempts, setScore]);

  useEffect(() => {
    if (!currentQuestion) {
      const question = generateQuestion();
      setAnswers(generateAnswers(question.answer));
    }
  }, [currentQuestion, currentLevelConfig.id, generateAnswers, generateQuestion]);

  const loadNextQuestion = () => {
    const nextQuestion = generateQuestion();
    setAnswers(generateAnswers(nextQuestion.answer));
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setAttempts(0);
  };

  const finishLevel = ({ finalScore, totalAnswered, totalWrongQuestions, success }) => {
    const result = success
      ? completeCurrentLevel({
          score: finalScore,
          questionsAnswered: totalAnswered,
          wrongQuestions: totalWrongQuestions,
        })
      : {
          levelId: currentLevelConfig.id,
          levelName: currentLevelConfig.name,
          starsEarned: 0,
          bananasEarned: 0,
          score: finalScore,
          questionsAnswered: totalAnswered,
          wrongQuestions: totalWrongQuestions,
          nextUnlockedLevel: currentLevelConfig.id,
          nextLevelId: currentLevelConfig.id,
        };

    navigate('/reward', {
      state: {
        result,
        success,
        goalQuestions: currentLevelConfig.questionCount,
      },
    });
  };

  const handleAnswer = (answer) => {
    if (!currentQuestion || showFeedback) {
      return;
    }

    const nextAttemptCount = attempts + 1;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setAttempts(nextAttemptCount);

    if (answer === currentQuestion.answer) {
      const nextScore = score + 1;
      const nextAnsweredCount = questionsAnswered + 1;

      setIsCorrect(true);
      setScore(nextScore);
      setQuestionsAnswered(nextAnsweredCount);

      setTimeout(() => {
        if (nextAnsweredCount >= currentLevelConfig.questionCount) {
          finishLevel({
            finalScore: nextScore,
            totalAnswered: nextAnsweredCount,
            totalWrongQuestions: wrongQuestionsCount,
            success: true,
          });
          return;
        }

        loadNextQuestion();
      }, 1000);
      return;
    }

    if (nextAttemptCount < MAX_ATTEMPTS_PER_QUESTION) {
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1000);
      return;
    }

    const nextWrongQuestionsCount = wrongQuestionsCount + 1;
    const nextAnsweredCount = questionsAnswered + 1;

    setWrongQuestionsCount(nextWrongQuestionsCount);
    setQuestionsAnswered(nextAnsweredCount);

    setTimeout(() => {
      if (nextWrongQuestionsCount >= MAX_WRONG_QUESTIONS) {
        finishLevel({
          finalScore: score,
          totalAnswered: nextAnsweredCount,
          totalWrongQuestions: nextWrongQuestionsCount,
          success: false,
        });
        return;
      }

      loadNextQuestion();
    }, 1000);
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-300 via-green-400 to-green-700 text-2xl font-bold text-yellow-100">
        Loading question...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-green-300 via-green-400 to-green-700 relative overflow-hidden px-2 py-4">
      <div className="flex items-center justify-between w-full max-w-3xl mb-6 px-2 gap-3">
        <div className="bg-white/85 rounded-xl px-4 py-2 shadow border-2 border-green-600 text-green-950 font-bold">
          <div>{currentLevelConfig.name}</div>
          <div className="text-sm">{currentLevelConfig.topic}</div>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl mb-4 text-sm md:text-base font-bold text-green-950">
        <div className="rounded-xl bg-white/85 px-4 py-3 border-2 border-green-600 shadow">
          Goal: {currentLevelConfig.questionCount} questions
        </div>
        <div className="rounded-xl bg-white/85 px-4 py-3 border-2 border-green-600 shadow">
          Remaining: {questionsRemaining}
        </div>
        <div className="rounded-xl bg-white/85 px-4 py-3 border-2 border-green-600 shadow">
          Missed questions: {wrongQuestionsCount}/{MAX_WRONG_QUESTIONS}
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 mb-8 flex flex-col items-center border-4 border-green-700">
        <h2 className="text-2xl md:text-3xl font-bold text-green-900 text-center mb-2 drop-shadow">
          {currentQuestion.question}
        </h2>
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
            disabled={showFeedback || isPaused}
          >
            {answer}
            {showFeedback && isCorrect && answer === currentQuestion.answer && ' 🟩'}
            {showFeedback && selectedAnswer === answer && answer !== currentQuestion.answer && ' ❌'}
          </button>
        ))}
      </div>

      <div className="text-lg font-bold text-white bg-green-800 bg-opacity-70 rounded-xl px-6 py-2 shadow border-2 border-green-900">
        Attempts: {attempts}/{MAX_ATTEMPTS_PER_QUESTION}
      </div>
      {isPaused && (
        <div className="mt-4 text-base font-bold text-white bg-green-900/80 rounded-xl px-5 py-3 border border-green-950">
          Game paused. Tap play to continue.
        </div>
      )}
    </div>
  );
};

export default GamePlay;
