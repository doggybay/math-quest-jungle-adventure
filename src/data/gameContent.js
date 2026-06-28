import { getLevelDefinition } from './levels';

const buildArithmeticQuestion = (difficulty) => {
  const operations = ['+', '-', '×', '÷'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  const maxValue = difficulty === 'hard' ? 20 : difficulty === 'medium' ? 14 : 10;
  let num1;
  let num2;
  let answer;

  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * maxValue);
      num2 = Math.floor(Math.random() * maxValue);
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * maxValue);
      num2 = Math.floor(Math.random() * Math.max(num1, 1));
      answer = num1 - num2;
      break;
    case '×':
      num1 = Math.floor(Math.random() * Math.max(6, Math.floor(maxValue / 2))) + 1;
      num2 = Math.floor(Math.random() * Math.max(6, Math.floor(maxValue / 2))) + 1;
      answer = num1 * num2;
      break;
    case '÷':
      num2 = Math.floor(Math.random() * 5) + 1;
      answer = Math.floor(Math.random() * Math.max(5, Math.floor(maxValue / 2))) + 1;
      num1 = num2 * answer;
      break;
    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
      break;
  }

  return {
    question: `What is ${num1} ${operation} ${num2}?`,
    answer: answer.toString(),
    type: 'arithmetic',
  };
};

const buildAlgebraQuestion = (difficulty) => {
  const operations = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  const maxValue = difficulty === 'hard' ? 12 : difficulty === 'medium' ? 9 : 6;
  const x = Math.floor(Math.random() * maxValue) + 1;
  const constant = Math.floor(Math.random() * maxValue) + 1;

  if (operation === '+') {
    return {
      question: `If x + ${constant} = ${x + constant}, what is x?`,
      answer: x.toString(),
      type: 'algebra',
    };
  }

  return {
    question: `If x - ${constant} = ${x - constant}, what is x?`,
    answer: x.toString(),
    type: 'algebra',
  };
};

const buildGeometryQuestion = (difficulty) => {
  const shape = Math.random() < 0.5 ? 'square' : 'rectangle';
  const maxValue = difficulty === 'hard' ? 10 : difficulty === 'medium' ? 8 : 5;

  if (shape === 'square') {
    const side = Math.floor(Math.random() * maxValue) + 1;
    return {
      question: `What is the area of a square with sides of length ${side}?`,
      answer: (side * side).toString(),
      type: 'geometry',
    };
  }

  const length = Math.floor(Math.random() * maxValue) + 1;
  const width = Math.floor(Math.random() * maxValue) + 1;
  return {
    question: `What is the area of a rectangle with length ${length} and width ${width}?`,
    answer: (length * width).toString(),
    type: 'geometry',
  };
};

export const QUESTION_GENERATORS = {
  arithmetic: buildArithmeticQuestion,
  algebra: buildAlgebraQuestion,
  geometry: buildGeometryQuestion,
};

export const generateQuestionForLevel = (levelOrId) => {
  const level = typeof levelOrId === 'object' ? levelOrId : getLevelDefinition(levelOrId);
  const allowedTopics = level?.allowedTopics?.length ? level.allowedTopics : Object.keys(QUESTION_GENERATORS);
  const randomTopic = allowedTopics[Math.floor(Math.random() * allowedTopics.length)];
  return QUESTION_GENERATORS[randomTopic](level?.difficulty ?? 'easy');
};

export const generateAnswerChoices = (correctAnswer) => {
  const answers = new Set([correctAnswer]);
  while (answers.size < 3) {
    const offset = Math.floor(Math.random() * 7) - 3;
    const wrongAnswer = (parseInt(correctAnswer, 10) + offset).toString();
    if (wrongAnswer !== correctAnswer && Number(wrongAnswer) >= 0) {
      answers.add(wrongAnswer);
    }
  }
  return Array.from(answers).sort(() => Math.random() - 0.5);
};
