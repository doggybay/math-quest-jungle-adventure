import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { buildAdventurePath } from '../data/adventureMap';
import { generateAnswerChoices, generateQuestionForLevel } from '../data/gameContent';
import { LEVEL_DEFINITIONS } from '../data/levels';
import { trackAnalyticsEvent } from '../lib/analytics';

const GameContext = createContext();

export const GAME_PROGRESS_STORAGE_KEY = 'jungle-adventure-progress-v1';

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

  const trackEvent = useCallback((event, payload = {}) => {
    trackAnalyticsEvent(event, payload);
  }, []);

  const resetRunState = useCallback(() => {
    setCurrentQuestion(null);
    setScore(0);
    setAttempts(0);
    setAdventure(null);
  }, []);

  const selectLevel = useCallback(
    (levelId, options = {}) => {
      const parsedLevelId = Number(levelId);

      if (parsedLevelId > progress.unlockedLevel) {
        return false;
      }

      setCurrentLevel(parsedLevelId);
      resetRunState();
      trackEvent('level_selected', {
        levelId: parsedLevelId,
        mode: options.mode ?? 'manual',
      });
      return true;
    },
    [progress.unlockedLevel, resetRunState, trackEvent]
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
    trackEvent('adventure_started', {
      levelId: currentLevelConfig.id,
      levelName: currentLevelConfig.name,
      encounterCount: nextAdventure.nodes.length,
      questionGoal: nextAdventure.totalQuestionGoal,
    });
    return nextAdventure;
  }, [currentLevelConfig, trackEvent]);

  const generateQuestion = useCallback(() => {
    const question = generateQuestionForLevel(currentLevelConfig);
    setCurrentQuestion(question);
    setAttempts(0);
    return question;
  }, [currentLevelConfig]);

  const generateAnswers = useCallback((correctAnswer) => generateAnswerChoices(correctAnswer), []);

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

      const completionResult = {
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

      trackEvent('level_completed', completionResult);
      return completionResult;
    },
    [currentLevelConfig, progress, trackEvent]
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
        const failureResult = {
          levelId: currentLevelConfig.id,
          levelName: currentLevelConfig.name,
          starsEarned: 0,
          bananasEarned: 0,
          score: finalScore,
          questionsAnswered: nextTotalQuestionsAnswered,
          wrongQuestions: nextTotalWrongQuestions,
          nextUnlockedLevel: currentLevelConfig.id,
          nextLevelId: currentLevelConfig.id,
        };

        trackEvent('adventure_failed', {
          encounterId: currentEncounter.id,
          encounterTitle: currentEncounter.title,
          ...failureResult,
        });
        setAdventure(null);
        setCurrentQuestion(null);
        setAttempts(0);
        return {
          status: 'failed',
          result: failureResult,
        };
      }

      if (!isFinalEncounter) {
        trackEvent('encounter_completed', {
          levelId: currentLevelConfig.id,
          encounterId: currentEncounter.id,
          encounterTitle: currentEncounter.title,
          questionsAnswered: nextTotalQuestionsAnswered,
          wrongQuestions: nextTotalWrongQuestions,
        });
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

      trackEvent('adventure_completed', {
        encounterId: currentEncounter.id,
        encounterTitle: currentEncounter.title,
        ...completionResult,
      });

      setAdventure(null);
      setCurrentQuestion(null);
      setAttempts(0);

      return {
        status: 'completed',
        result: completionResult,
      };
    },
    [adventure, completeCurrentLevel, currentEncounter, currentLevelConfig, trackEvent]
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
    trackEvent,
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
