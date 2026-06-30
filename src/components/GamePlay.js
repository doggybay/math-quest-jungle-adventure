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
    adventure,
    attempts,
    currentEncounter,
    currentLevelConfig,
    currentQuestion,
    generateAnswers,
    generateQuestion,
    resolveEncounter,
    score,
    setAttempts,
    setScore,
    trackEvent,
  } = useGame();

  const questionsRemaining = useMemo(
    () => Math.max((currentEncounter?.questionCount ?? 0) - questionsAnswered, 0),
    [currentEncounter, questionsAnswered]
  );

  useEffect(() => {
    if (!currentEncounter) {
      navigate('/map');
      return;
    }

    const question = generateQuestion();
    setAnswers(generateAnswers(question.answer));
    setAttempts(0);
    setWrongQuestionsCount(0);
    setQuestionsAnswered(0);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setIsPaused(false);
  }, [currentEncounter, generateAnswers, generateQuestion, navigate, setAttempts]);

  const loadNextQuestion = () => {
    const nextQuestion = generateQuestion();
    setAnswers(generateAnswers(nextQuestion.answer));
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setAttempts(0);
  };

  const finishRun = ({ finalScore, totalAnswered, totalWrongQuestions, success }) => {
    const resolution = resolveEncounter({
      success,
      score: finalScore,
      questionsAnswered: totalAnswered,
      wrongQuestions: totalWrongQuestions,
    });

    if (resolution.status === 'continue') {
      navigate('/map');
      return;
    }

    if (resolution.status === 'completed' || resolution.status === 'failed') {
      navigate('/reward', {
        state: {
          result: resolution.result,
          success,
          goalQuestions: adventure?.totalQuestionGoal ?? currentLevelConfig.questionCount,
        },
      });
      return;
    }

    navigate('/map');
  };

  const handleAnswer = (answer) => {
    if (!currentQuestion || showFeedback) {
      return;
    }

    const nextAttemptCount = attempts + 1;
    const wasCorrect = answer === currentQuestion.answer;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setAttempts(nextAttemptCount);
    trackEvent('answer_submitted', {
      levelId: currentLevelConfig.id,
      encounterId: currentEncounter.id,
      encounterTitle: currentEncounter.title,
      questionType: currentQuestion.type,
      selectedAnswer: answer,
      correctAnswer: currentQuestion.answer,
      wasCorrect,
      attemptNumber: nextAttemptCount,
    });

    if (wasCorrect) {
      const nextScore = score + 1;
      const nextAnsweredCount = questionsAnswered + 1;

      setIsCorrect(true);
      setScore(nextScore);
      setQuestionsAnswered(nextAnsweredCount);

      setTimeout(() => {
        if (nextAnsweredCount >= currentEncounter.questionCount) {
          finishRun({
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
    const combinedWrongQuestions = (adventure?.totalWrongQuestions ?? 0) + nextWrongQuestionsCount;

    setWrongQuestionsCount(nextWrongQuestionsCount);
    setQuestionsAnswered(nextAnsweredCount);

    setTimeout(() => {
      if (combinedWrongQuestions >= MAX_WRONG_QUESTIONS) {
        finishRun({
          finalScore: score,
          totalAnswered: nextAnsweredCount,
          totalWrongQuestions: nextWrongQuestionsCount,
          success: false,
        });
        return;
      }

      if (nextAnsweredCount >= currentEncounter.questionCount) {
        finishRun({
          finalScore: score,
          totalAnswered: nextAnsweredCount,
          totalWrongQuestions: nextWrongQuestionsCount,
          success: true,
        });
        return;
      }

      loadNextQuestion();
    }, 1000);
  };

  if (!currentQuestion || !currentEncounter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-300 via-green-400 to-green-700 text-2xl font-bold text-yellow-100">
        Loading encounter...
      </div>
    );
  }

  return (
    <main
      id="main-content"
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-green-300 via-green-400 to-green-700 px-2 py-4"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center">
        <div className="mb-6 flex w-full items-center justify-between gap-3 px-2">
          <div className="rounded-xl border-2 border-green-600 bg-white/85 px-4 py-2 font-bold text-green-950 shadow">
            <div>{currentLevelConfig.name}</div>
            <div className="text-sm">
              Encounter {currentEncounter.sequence}/{adventure?.nodes.length ?? 1}: {currentEncounter.shortLabel}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border-2 border-yellow-400 bg-yellow-200/80 px-4 py-2 shadow">
            <span className="text-lg font-bold text-yellow-900">🍌 x {score}</span>
          </div>
          <button
            className="rounded-full bg-green-800/80 p-3 text-2xl text-white shadow-lg transition hover:bg-green-700"
            onClick={() => setIsPaused(true)}
            aria-label="Pause adventure"
          >
            ⏸
          </button>
        </div>

        <div className="mb-4 grid w-full max-w-3xl grid-cols-1 gap-3 text-sm font-bold text-green-950 md:grid-cols-3 md:text-base">
          <div className="rounded-xl border-2 border-green-600 bg-white/85 px-4 py-3 shadow">
            Goal here: {currentEncounter.questionCount} questions
          </div>
          <div className="rounded-xl border-2 border-green-600 bg-white/85 px-4 py-3 shadow">
            Remaining here: {questionsRemaining}
          </div>
          <div className="rounded-xl border-2 border-green-600 bg-white/85 px-4 py-3 shadow">
            Total misses: {(adventure?.totalWrongQuestions ?? 0) + wrongQuestionsCount}/{MAX_WRONG_QUESTIONS}
          </div>
        </div>

        <div className="mb-4 flex w-full max-w-2xl flex-col items-center rounded-2xl border-4 border-green-700 bg-white/90 p-6 shadow-xl">
          <div className="mb-2 text-sm font-extrabold uppercase tracking-wide text-green-700 md:text-base">
            {currentEncounter.icon} {currentEncounter.title}
          </div>
          <p className="mb-4 text-center text-base font-semibold text-green-900 md:text-lg">
            {currentEncounter.description}
          </p>
          <h2 className="text-center text-2xl font-bold text-green-900 drop-shadow md:text-3xl">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="mb-8 grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
          {answers.map((answer, index) => (
            <button
              key={index}
              className={`w-full rounded-xl border-4 py-5 text-2xl font-bold transition shadow-xl ${
                showFeedback
                  ? isCorrect && answer === currentQuestion.answer
                    ? 'scale-105 border-green-700 bg-green-400 text-white'
                    : selectedAnswer === answer && answer !== currentQuestion.answer
                    ? 'shake border-red-700 bg-red-400 text-white'
                    : 'border-green-300 bg-white text-green-900'
                  : 'border-green-300 bg-white text-green-900 hover:scale-105 hover:bg-green-200 active:bg-green-300'
              }`}
              onClick={() => handleAnswer(answer)}
              disabled={showFeedback || isPaused}
            >
              {answer}
              {showFeedback && isCorrect && answer === currentQuestion.answer && ' 🟩'}
              {showFeedback && selectedAnswer === answer && answer !== currentQuestion.answer && ' ❌'}
            </button>
          ))}
        </div>

        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border-2 border-green-900 bg-green-800/70 px-6 py-2 text-lg font-bold text-white shadow"
        >
          Attempts: {attempts}/{MAX_ATTEMPTS_PER_QUESTION}
        </div>
      </div>

      {isPaused && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-green-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border-4 border-green-950/35 bg-white p-6 text-green-950 shadow-2xl">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-green-800/70">Adventure menu</div>
            <h3 className="mt-2 text-3xl font-black text-green-950">Adventure paused</h3>
            <p className="mt-3 text-base font-semibold leading-7 text-green-900/85">
              You are at {currentEncounter.title}. Resume when you are ready, or head back without losing the overall app state.
            </p>

            <div className="mt-5 rounded-2xl border-2 border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-900">
              Current run: {questionsAnswered} answered · {score} bananas · {(adventure?.totalWrongQuestions ?? 0) + wrongQuestionsCount} misses
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                className="w-full rounded-2xl border-4 border-orange-700 bg-gradient-to-b from-orange-300 to-orange-500 px-5 py-4 text-left text-xl font-black text-white shadow-lg transition hover:-translate-y-1 hover:from-orange-200 hover:to-orange-400"
                onClick={() => setIsPaused(false)}
              >
                Resume Adventure
              </button>
              <button
                className="w-full rounded-2xl border-4 border-green-700 bg-white px-5 py-4 text-left text-lg font-black text-green-950 shadow transition hover:-translate-y-1 hover:bg-green-50"
                onClick={() => navigate('/map')}
              >
                Back to Map
              </button>
              <button
                className="w-full rounded-2xl border-4 border-green-700 bg-white px-5 py-4 text-left text-lg font-black text-green-950 shadow transition hover:-translate-y-1 hover:bg-green-50"
                onClick={() => navigate('/levels')}
              >
                Return to Level Select
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default GamePlay;
