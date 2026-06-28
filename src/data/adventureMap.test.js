import { buildAdventurePath, distributeQuestionCounts } from './adventureMap';

describe('adventure map helpers', () => {
  test('distributes question counts across encounters without losing total questions', () => {
    expect(distributeQuestionCounts(4, 3)).toEqual([2, 1, 1]);
    expect(distributeQuestionCounts(7, 3)).toEqual([3, 2, 2]);
    expect(distributeQuestionCounts(2, 1)).toEqual([2]);
  });

  test('builds a stable encounter path from a level definition', () => {
    const path = buildAdventurePath({
      id: 3,
      name: 'River Riddles',
      questionCount: 5,
      encounters: [
        { type: 'raft', title: 'Raft Crossing', icon: '🛶', shortLabel: 'Raft', description: 'Cross the river.' },
        { type: 'bank', title: 'Crocodile Bank', icon: '🐊', shortLabel: 'Bank', description: 'Hold the bank.' },
        { type: 'shrine', title: 'River Shrine', icon: '⛩️', shortLabel: 'Shrine', description: 'Unlock the shrine.' },
      ],
    });

    expect(path.levelId).toBe(3);
    expect(path.levelName).toBe('River Riddles');
    expect(path.totalQuestionGoal).toBe(5);
    expect(path.nodes).toHaveLength(3);
    expect(path.nodes.map((node) => node.questionCount)).toEqual([2, 2, 1]);
    expect(path.nodes[0]).toMatchObject({
      id: '3-raft-1',
      sequence: 1,
      title: 'Raft Crossing',
    });
  });
});
