import { generateAnswerChoices, generateQuestionForLevel } from './gameContent';

describe('game content helpers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('uses a level topic pool when generating questions', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const question = generateQuestionForLevel({
      allowedTopics: ['arithmetic'],
      difficulty: 'easy',
    });

    expect(question.type).toBe('arithmetic');
    expect(question.question).toMatch(/what is/i);
  });

  test('builds distinct answer choices that include the correct answer', () => {
    const answers = generateAnswerChoices('12');

    expect(answers).toContain('12');
    expect(new Set(answers).size).toBe(answers.length);
    expect(answers).toHaveLength(3);
    expect(answers.every((value) => Number(value) >= 0)).toBe(true);
  });
});
