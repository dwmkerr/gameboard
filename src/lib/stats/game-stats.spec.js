import testGames from './test-games.json';
import gameStats from './game-stats';

test('should be able to work out the stats from the test data', () => {
  const playerId = 'WisNqBdHXxPGuULiAMDo0zSE5ib2';
  const stats = gameStats(playerId, testGames);
  expect(stats).not.toEqual(null);
});
