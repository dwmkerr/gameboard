/* global it expect */
import testGames from './test-games.json';
import gameStats from './game-stats';

it('should be able to work out the stats from the test data', () => {
  const playerId = 'alice';
  const stats = gameStats(playerId, testGames);
  expect(stats).not.toEqual(null);
});
