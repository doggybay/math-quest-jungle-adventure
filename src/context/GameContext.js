import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { buildAdventurePath } from '../data/adventureMap';

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
    encounters: [
      {
        type: 'bridge',
        title: 'Vine Bridge',
        shortLabel: 'Bridge',
        icon: '🌉',
        description: 'Cross the hanging bridge while the canopy sways overhead.',
      },
      {
        type: 'rescue',
        title: 'Monkey Rescue',
        shortLabel: 'Rescue',
        icon: '🐒',
        description: 'Help the scout monkeys regroup before the path disappears.',
      },
      {
        type: 'gate',
        title: 'Temple Gate',
        shortLabel: 'Gate',
        icon: '🛕',
        description: 'Unlock the carved gate that guards the next stretch of jungle.',
      },
    ],
  },
  {
    id: 2,
    name: 'Temple Steps',
    topic: 'Arithmetic',
    allowedTopics: ['arithmetic'],
    questionCount: 5,
    difficulty: 'easy',
    encounters: [
      {
        type: 'stairs',
        title: 'Broken Steps',
        shortLabel: 'Steps',
        icon: '🪜',
        description: 'Count the safe footholds up the cracked staircase.',
      },
      {
        type: 'torch',
        title: 'Torch Gallery',
        shortLabel: 'Gallery',
        icon: '🔥',
        description: 'Light the gallery in the right order to keep moving.',
      },
      {
        type: 'altar',
        title: 'Hidden Altar',
        shortLabel: 'Altar',
        icon: '🗿',
        description: 'Solve the altar puzzle before the stone doors close again.',
      },
    ],
  },
  {
    id: 3,
    name: 'River Riddles',
    topic: 'Algebra',
    allowedTopics: ['algebra'],
    questionCount: 5,
    difficulty: 'medium',
    encounters: [
      {
        type: 'raft',
        title: 'Raft Crossing',
        shortLabel: 'Raft',
        icon: '🛶',
        description: 'Balance the raft and read the current before it pulls you downstream.',
      },
      {
        type: 'bank',
        title: 'Crocodile Bank',
        shortLabel: 'Bank',
        icon: '🐊',
        description: 'Keep the crocodiles at bay while you hold the riverbank.',
      },
      {
        type: 'shrine',
        title: 'River Shrine',
        shortLabel: 'Shrine',
        icon: '⛩️',
        description: 'Unlock the shrine with the final pattern from the river spirits.',
      },
    ],
  },
  {
    id: 4,
    name: 'Stone Garden',
    topic: 'Geometry',
    allowedTopics: ['geometry'],
    questionCount: 6,
    difficulty: 'medium',
    encounters: [
      {
        type: 'maze',
        title: 'Stone Maze',
        shortLabel: 'Maze',
        icon: '🧱',
        description: 'Read the angles in the stone paths to avoid dead ends.',
      },
      {
        type: 'pond',
        title: 'Mirror Pond',
        shortLabel: 'Pond',
        icon: '🪞',
        description: 'Use reflected shapes to reveal the hidden walkway.',
      },
      {
        type: 'keeper',
        title: 'Garden Keeper',
        shortLabel: 'Keeper',
        icon: '🪨',
        description: 'Convince the ancient keeper to open the final gate.',
      },
    ],
  },
  {
    id: 5,
    name: 'Golden Idol',
    topic: 'Mixed Mastery',
    allowedTopics: ['arithmetic', 'algebra', 'geometry'],
    questionCount: 7,
    difficulty: 'hard',
    encounters: [
      {
        type: 'vault',
        title: 'Outer Vault',
        shortLabel: 'Vault',
        icon: '🪙',
        description: 'Unlock the outer chamber without waking the traps.',
      },
      {
        type: 'chamber',
        title: 'Echo Chamber',
        shortLabel: 'Echo',
        icon: '🔔',
        description: 'Match the echoing patterns before the chamber seals.',
      },
      {
        type: 'idol',
        title: 'Idol Sanctum',
        shortLabel: 'Sanctum',
        icon: '✨',
        description: 'Claim the idol by mastering every lesson the jungle taught you.',
      },
    ],
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
  const [adventure, setAdventure] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(GAME_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    setCurrentLevel((activeLevel) => Math.min(activeLevel, clampUnlockedLevel(progress.unlockedLevel)));
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

  const currentEncounter = useMemo(() => {
    if (!adventure) {
      return null;
    }
    return adventure.nodes[adventure.currentEncounterIndex] ?? null;
  }, [adventure]);

  const resetRunState = useCallback(() => {
    setCurrentQuestion(null);
    setScore(0);
    setAttempts(0);
    setAdventure(null);
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

  const startAdventure = useCallback(() => {
    if (!currentLevelConfig) {
      return null;
    }

    const nextAdventure = buildAdventurePath(currentLevelConfig);
    setAdventure(nextAdventure);
    setCurrentQuestion(null);
    setScore(0);
    setAttempts(0);
    return nextAdventure;
  }, [currentLevelConfig]);

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

  const resolveEncounter = useCallback(
    ({ success, score: finalScore, questionsAnswered, wrongQuestions }) => {
      if (!adventure || !currentEncounter) {
        return {
          status: 'missing-adventure',
          result: null,
        };
      }

      const nextTotalQuestionsAnswered = adventure.totalQuestionsAnswered + questionsAnswered;
      const nextTotalWrongQuestions = adventure.totalWrongQuestions + wrongQuestions;
      const isFinalEncounter = adventure.currentEncounterIndex >= adventure.nodes.length - 1;

      if (!success) {
        setAdventure(null);
        setCurrentQuestion(null);
        setAttempts(0);
        return {
          status: 'failed',
          result: {
            levelId: currentLevelConfig.id,
            levelName: currentLevelConfig.name,
            starsEarned: 0,
            bananasEarned: 0,
            score: finalScore,
            questionsAnswered: nextTotalQuestionsAnswered,
            wrongQuestions: nextTotalWrongQuestions,
            nextUnlockedLevel: currentLevelConfig.id,
            nextLevelId: currentLevelConfig.id,
          },
        };
      }

      if (!isFinalEncounter) {
        setAdventure((previousAdventure) => ({
          ...previousAdventure,
          totalQuestionsAnswered: nextTotalQuestionsAnswered,
          totalWrongQuestions: nextTotalWrongQuestions,
          completedEncounters: previousAdventure.completedEncounters + 1,
          currentEncounterIndex: previousAdventure.currentEncounterIndex + 1,
        }));
        setCurrentQuestion(null);
        setAttempts(0);
        return {
          status: 'continue',
          result: null,
        };
      }

      const completionResult = completeCurrentLevel({
        score: finalScore,
        questionsAnswered: nextTotalQuestionsAnswered,
        wrongQuestions: nextTotalWrongQuestions,
      });

      setAdventure(null);
      setCurrentQuestion(null);
      setAttempts(0);

      return {
        status: 'completed',
        result: completionResult,
      };
    },
    [adventure, completeCurrentLevel, currentEncounter, currentLevelConfig]
  );

  const resetGame = useCallback(() => {
    resetRunState();
    setCurrentLevel(1);
  }, [resetRunState]);

  const value = {
    adventure,
    attempts,
    bananas: progress.bananas,
    completeCurrentLevel,
    currentEncounter,
    currentLevel,
    currentLevelConfig,
    currentQuestion,
    generateAnswers,
    generateQuestion,
    levelProgress: progress.levelProgress,
    levels,
    resetGame,
    resolveEncounter,
    score,
    selectLevel,
    setAttempts,
    setCurrentLevel,
    setScore,
    startAdventure,
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
