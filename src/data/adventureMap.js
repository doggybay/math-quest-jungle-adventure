export const distributeQuestionCounts = (totalQuestions, nodeCount) => {
  if (nodeCount <= 0) {
    return [];
  }

  const safeTotal = Math.max(totalQuestions, nodeCount);
  const baseCount = Math.floor(safeTotal / nodeCount);
  const remainder = safeTotal % nodeCount;

  return Array.from({ length: nodeCount }, (_, index) => baseCount + (index < remainder ? 1 : 0));
};

export const buildAdventurePath = (level) => {
  const encounters = level?.encounters ?? [];
  const questionCounts = distributeQuestionCounts(level?.questionCount ?? encounters.length, encounters.length);

  return {
    levelId: level.id,
    levelName: level.name,
    totalQuestionGoal: level.questionCount,
    totalQuestionsAnswered: 0,
    totalWrongQuestions: 0,
    completedEncounters: 0,
    currentEncounterIndex: 0,
    nodes: encounters.map((encounter, index) => ({
      id: `${level.id}-${encounter.type}-${index + 1}`,
      sequence: index + 1,
      questionCount: questionCounts[index],
      ...encounter,
    })),
  };
};
