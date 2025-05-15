import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import './GamePlay.css';

const GamePlay = () => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [wrongQuestionsCount, setWrongQuestionsCount] = useState(0);
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

  // Generate initial question only when component mounts or level changes
  useEffect(() => {
    if (!currentQuestion) {
      const question = generateQuestion();
      setAnswers(generateAnswers(question.answer));
    }
  }, [currentLevel, currentQuestion, generateQuestion, generateAnswers]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setAttempts(attempts + 1);

    if (answer === currentQuestion.answer) {
      setIsCorrect(true);
      setScore(score + 1);
      setTimeout(() => {
        // Generate new question instead of navigating to reward
        const newQuestion = generateQuestion();
        setAnswers(generateAnswers(newQuestion.answer));
        setShowFeedback(false);
        setSelectedAnswer(null);
        setIsCorrect(false);
        setAttempts(0); // Reset attempts for new question
      }, 1000);
    } else if (attempts < 1) {
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1000);
    } else {
      // Question failed after 2 attempts
      setWrongQuestionsCount(wrongQuestionsCount + 1);
      
      if (wrongQuestionsCount >= 2) {
        setTimeout(() => {
          navigate('/levels');
        }, 1000);
      } else {
        setTimeout(() => {
          // Move to next question
          const newQuestion = generateQuestion();
          setAnswers(generateAnswers(newQuestion.answer));
          setShowFeedback(false);
          setSelectedAnswer(null);
          setAttempts(0); // Reset attempts for new question
        }, 1000);
      }
    }
  };

  if (!currentQuestion) {
    return <div className="loading">Loading question...</div>;
  }

  return (
    <div className="gameplay-container">
      <div className="game-header">
        <span className="character">🦜</span>
        <div className="rewards">
          <span>🍌 x {score}</span>
        </div>
        <button 
          className="pause-button"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? '▶' : '⏸'}
        </button>
      </div>

      <div className="question-box">
        <h2>{currentQuestion.question}</h2>
      </div>

      <div className="answers-container">
        {answers.map((answer, index) => (
          <button
            key={index}
            className={`answer-button ${
              showFeedback
                ? isCorrect && answer === currentQuestion.answer
                  ? 'correct'
                  : selectedAnswer === answer && answer !== currentQuestion.answer
                  ? 'incorrect'
                  : ''
                : ''
            }`}
            onClick={() => handleAnswer(answer)}
            disabled={showFeedback}
          >
            {answer}
            {showFeedback && isCorrect && answer === currentQuestion.answer && ' 🟩'}
            {showFeedback && selectedAnswer === answer && answer !== currentQuestion.answer && ' ❌'}
          </button>
        ))}
      </div>

      <div className="attempts-counter">
        Attempts: {attempts}/2
      </div>
    </div>
  );
};

export default GamePlay; 