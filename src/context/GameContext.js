import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

// 7th grade math topics and their question generators
const questionGenerators = {
  // Basic arithmetic with integers
  arithmetic: () => {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10);
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * num1); // Ensure positive result
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10);
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 5) + 1; // Avoid division by zero
        answer = Math.floor(Math.random() * 5) + 1;
        num1 = num2 * answer; // Ensure clean division
        break;
      default:
        // Fallback to addition if operation is somehow invalid
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10);
        answer = num1 + num2;
        break;
    }

    return {
      question: `What is ${num1} ${operation} ${num2}?`,
      answer: answer.toString(),
      type: 'arithmetic'
    };
  },

  // Simple algebraic expressions
  algebra: () => {
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const x = Math.floor(Math.random() * 5) + 1;
    const constant = Math.floor(Math.random() * 5) + 1;
    let answer;

    if (operation === '+') {
      answer = x + constant;
      return {
        question: `If x + ${constant} = ${answer}, what is x?`,
        answer: x.toString(),
        type: 'algebra'
      };
    } else {
      answer = x - constant;
      return {
        question: `If x - ${constant} = ${answer}, what is x?`,
        answer: x.toString(),
        type: 'algebra'
      };
    }
  },

  // Simple geometry (area of squares and rectangles)
  geometry: () => {
    const shape = Math.random() < 0.5 ? 'square' : 'rectangle';
    let length, width, answer;

    if (shape === 'square') {
      length = Math.floor(Math.random() * 5) + 1;
      answer = length * length;
      return {
        question: `What is the area of a square with sides of length ${length}?`,
        answer: answer.toString(),
        type: 'geometry'
      };
    } else {
      length = Math.floor(Math.random() * 5) + 1;
      width = Math.floor(Math.random() * 5) + 1;
      answer = length * width;
      return {
        question: `What is the area of a rectangle with length ${length} and width ${width}?`,
        answer: answer.toString(),
        type: 'geometry'
      };
    }
  }
};

export const GameProvider = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);

  const generateQuestion = () => {
    const topics = Object.keys(questionGenerators);
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const question = questionGenerators[randomTopic]();
    setCurrentQuestion(question);
    setAttempts(0);
    return question;
  };

  const generateAnswers = (correctAnswer) => {
    const answers = new Set([correctAnswer]);
    while (answers.size < 3) {
      const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const wrongAnswer = (parseInt(correctAnswer) + offset).toString();
      if (wrongAnswer !== correctAnswer && parseInt(wrongAnswer) >= 0) {
        answers.add(wrongAnswer);
      }
    }
    return Array.from(answers).sort(() => Math.random() - 0.5);
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setTotalStars(0);
    setCurrentQuestion(null);
  };

  const value = {
    currentQuestion,
    generateQuestion,
    generateAnswers,
    score,
    setScore,
    attempts,
    setAttempts,
    totalStars,
    setTotalStars,
    currentLevel,
    setCurrentLevel,
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 