import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const GameContext = createContext();

export const GAME_PROGRESS_STORAGE_KEY = 'jungle-adventure-progress-v1';

const LEVEL_DEFINITIONS = [
  {
    id: 1,
    name: 'Canopy Trail',
    topic: 'Mixed Basics',
    allowedTopics: ['arithmetic', 'algebra'],
    questionCount: 4,
    difficulty: 'easy',
  },
  {
    id: 2,
    name: 'Temple Steps',
    topic: 'Arithmetic',
    allowedTopics: ['arithmetic'],
    questionCount: 5,
    difficulty: 'easy',
  },
  {
    id: 3,
    name: 'River Riddles',
    topic: 'Algebra',
    allowedTopics: ['algebra'],
    questionCount: 5,
    difficulty: 'medium',
  },
  {
    id: 4,
    name: 'Stone Garden',
    topic: 'Geometry',
    allowedTopics: ['geometry'],
    questionCount: 6,
    difficulty: 'medium',
  },
  {
    id: 5,
    name: 'Golden Idol',
    topic: 'Mixed Mastery',
    allowedTopics: ['arithmetic', 'algebra', 'geometry'],
    questionCount: 7,
    difficulty: 'hard',
  },
];

const DEFAULT_PROGRESS = {
  version: 1,
  unlockedLevel: 1,
  bananas: 0,
  levelProgress: {},
};

const clampUnlockedLevel = (value) => {
  const maxLevel = LEVEL_DEFINITIONS.length;
  return Math.min(Math.max(value, 1), maxLevel);
};

const loadStoredProgress = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_PROGRESS;
  }

  try {
    const rawProgress = window.localStorage.getItem(GAME_PROGRESS_STORAGE_KEY);
    if (!rawProgress) {
      return DEFAULT_PROGRESS;
    }

    const parsed = JSON.parse(rawProgress);

    return {
      version: 1,
      unlockedLevel: clampUnlockedLevel(parsed.unlockedLevel ?? 1),
      bananas: Number(parsed.bananas ?? 0),
      levelProgress: parsed.levelProgress ?? {},
    };
  } catch (error) {
    console.warn('Unable to read stored Jungle Adventure progress.', error);
    return DEFAULT_PROGRESS;
  }
};

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

const questionGenerators = {
  arithmetic: buildArithmeticQuestion,
  algebra: buildAlgebraQuestion,
  geometry: buildGeometryQuestion,
};

const calculateStars = ({ score, questionsAnswered, wrongQuestions }) => {
  if (!questionsAnswered || score <= 0) {
    return 0;
  }

  if (score === questionsAnswered && wrongQuestions === 0) {
    return 3;
  }

  if (wrongQuestions <= 1) {
    return 2;
  }

  return 1;
};

const calculateBananas = ({ score, starsEarned }) => score * 3 + starsEarned;

export const GameProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => loadStoredProgress());
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(GAME_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    setCurrentLevel((activeLevel) =>
      Math.min(activeLevel, clampUnlockedLevel(progress.unlockedLevel))
    );
  }, [progress.unlockedLevel]);

  const levels = useMemo(
    () =>
      LEVEL_DEFINITIONS.map((level) => {
        const savedLevel = progress.levelProgress[level.id] ?? {};
        return {
          ...level,
          isUnlocked: level.id <= progress.unlockedLevel,
          completed: Boolean(savedLevel.completed),
          bestStars: savedLevel.bestStars ?? 0,
          bestScore: savedLevel.bestScore ?? 0,
          bananasEarned: savedLevel.bananasEarned ?? 0,
        };
      }),
    [progress]
  );

  const currentLevelConfig = useMemo(
    () => levels.find((level) => level.id === currentLevel) ?? levels[0],
    [currentLevel, levels]
  );

  const totalStars = useMemo(
    () => Object.values(progress.levelProgress).reduce((sum, level) => sum + (level.bestStars ?? 0), 0),
    [progress.levelProgress]
  );

  const resetRunState = useCallback(() => {
    setCurrentQuestion(null);
    setScore(0);
    setAttempts(0);
  }, []);

  const selectLevel = useCallback(
    (levelId) => {
      const parsedLevelId = Number(levelId);
      if (parsedLevelId > progress.unlockedLevel) {
        return false;
      }

      setCurrentLevel(parsedLevelId);
      resetRunState();
      return true;
    },
    [progress.unlockedLevel, resetRunState]
  );

  const generateQuestion = useCallback(() => {
    const availableTopics = currentLevelConfig?.allowedTopics?.length
      ? currentLevelConfig.allowedTopics
      : Object.keys(questionGenerators);
    const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
    const question = questionGenerators[randomTopic](currentLevelConfig?.difficulty ?? 'easy');
    setCurrentQuestion(question);
    setAttempts(0);
    return question;
  }, [currentLevelConfig]);

  const generateAnswers = useCallback((correctAnswer) => {
    const answers = new Set([correctAnswer]);
    while (answers.size < 3) {
      const offset = Math.floor(Math.random() * 7) - 3;
      const wrongAnswer = (parseInt(correctAnswer, 10) + offset).toString();
      if (wrongAnswer !== correctAnswer && Number(wrongAnswer) >= 0) {
        answers.add(wrongAnswer);
      }
    }
    return Array.from(answers).sort(() => Math.random() - 0.5);
  }, []);

  const completeCurrentLevel = useCallback(
    ({ score: finalScore, questionsAnswered, wrongQuestions }) => {
      const starsEarned = calculateStars({
        score: finalScore,
        questionsAnswered,
        wrongQuestions,
      });
      const bananasEarned = calculateBananas({
        score: finalScore,
        starsEarned,
      });
      const nextUnlockedLevel = clampUnlockedLevel(
        Math.max(progress.unlockedLevel, currentLevelConfig.id + 1)
      );

      const previousLevelProgress = progress.levelProgress[currentLevelConfig.id] ?? {};
      const updatedLevelProgress = {
        ...progress.levelProgress,
        [currentLevelConfig.id]: {
          completed: true,
          bestStars: Math.max(previousLevelProgress.bestStars ?? 0, starsEarned),
          bestScore: Math.max(previousLevelProgress.bestScore ?? 0, finalScore),
          bananasEarned: Math.max(previousLevelProgress.bananasEarned ?? 0, bananasEarned),
          lastScore: finalScore,
          lastWrongQuestions: wrongQuestions,
        },
      };

      setProgress((previousProgress) => ({
        ...previousProgress,
        bananas: previousProgress.bananas + bananasEarned,
        unlockedLevel: Math.max(previousProgress.unlockedLevel, nextUnlockedLevel),
        levelProgress: updatedLevelProgress,
      }));

      return {
        levelId: currentLevelConfig.id,
        levelName: currentLevelConfig.name,
        starsEarned,
        bananasEarned,
        score: finalScore,
        questionsAnswered,
        wrongQuestions,
        nextUnlockedLevel,
        nextLevelId: Math.min(currentLevelConfig.id + 1, LEVEL_DEFINITIONS.length),
      };
    },
    [currentLevelConfig, progress]
  );

  const resetGame = useCallback(() => {
    resetRunState();
    setCurrentLevel(1);
  }, [resetRunState]);

  const value = {
    bananas: progress.bananas,
    currentLevel,
    currentLevelConfig,
    currentQuestion,
    completeCurrentLevel,
    generateAnswers,
    generateQuestion,
    levelProgress: progress.levelProgress,
    levels,
    resetGame,
    score,
    selectLevel,
    setAttempts,
    attempts,
    setCurrentLevel,
    setScore,
    totalStars,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
