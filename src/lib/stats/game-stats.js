import moment from 'moment';

function max(a, b) {
  return a > b ? a : b;
}

export default function gameStats(playerId, playedGames) {
  //  The stats.
  const wonGames = [];
  let played = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  const scores = [];
  let bestScore = null;
  let averageScore = null;
  const beaters = {};
  let nemesisName = null;
  let nemesisWins = null;
  let nemesisBeat = null;

  //  The easiest way to build the stats is loop through each game.
  for (let i = 0; i < playedGames.length; i += 1) {
    const game = playedGames[i];
    played += 1;
    const me = game.players.find(p => p.id === playerId);

    //  A bit off if we cannot find the player record, without it there's not
    //  much we can do so skip.
    //  eslint-disable-next-line no-continue
    if (!me) continue;

    if (me.rank === 1) {
      wonGames.push(game);
      currentStreak += 1;
      longestStreak = max(currentStreak, longestStreak);
    } else {
      currentStreak = 0;
    }

    if (me.score !== null || me.score !== undefined) {
      scores.push(me.score);
    }

    //  Find the winner, if it's not us then we're going to track them as a beater.
    const winner = game.players.reduce((acc, p) =>
      (acc === null || p.rank > acc.rank ? p : acc), null);
    if (winner.id !== playerId) {
      if (beaters[winner.id]) beaters[winner.id].push(winner);
      else beaters[winner.id] = [winner];
    }
  }

  //  Nemesis is the beater with the most wins.
  const nemesis = Object.keys(beaters).reduce((acc, key) => {
    const beater = beaters[key];
    return (acc === null || beater.length > acc.length ? beater : acc);
  }, null);
  if (nemesis) {
    nemesisName = nemesis[0].name;
    nemesisWins = nemesis.length;
    nemesisBeat = wonGames.reduce((a, pg) => {
      if (pg.players.find(p => p.if === nemesis[0].id)) {
        return a + 1;
      }
      return a;
    });
  }

  //  Check how many times we beat the nemesis.
  if (scores.length > 0) {
    bestScore = scores.reduce((acc, s) => (s > acc ? s : acc), null);
    averageScore = scores.reduce((acc, s) => acc + s, 0) / scores.length;
  }

  //  Get the most recent timestamp.
  const mostRecentTimestamp = playedGames.reduce((acc, val) => {
    if (val.createdAt > acc) return val.createdAt;
    return acc;
  }, 0);

  const mostRecent = mostRecentTimestamp === 0
    ? 'Never'
    : moment.unix(mostRecentTimestamp / 1000).fromNow();

  return {
    played,
    won: wonGames.length,
    longestStreak,
    lastPlayed: mostRecent,
    bestScore,
    averageScore,
    nemesisName,
    nemesisWins,
    nemesisBeat,
  };
}
