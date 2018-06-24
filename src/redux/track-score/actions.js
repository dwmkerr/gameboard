import firebase from 'react-native-firebase';

export function start() {
  //  When we start tracking the score for a game, we'll create an initial set
  //  of players which include the current user.
  const {
    uid,
    displayName,
    email,
    photoURL,
  } = firebase.auth().currentUser;

  const initialPlayers = [{
    id: uid,
    name: displayName,
    email,
    imageUri: photoURL,
    rank: null,
  }];

  return {
    type: 'TRACK_SCORE_START',
    data: {
      game: null,
      players: initialPlayers,
    },
  };
}

export function setGame(game) {
  return {
    type: 'TRACK_SCORE_SET_GAME',
    data: game,
  };
}

export function addPlayer(player) {
  //  Whenever we add a player, if we don't have an id, set one.
  if (!player.id) Object.assign(player, { id: (player.email || player.name) });
  if (player.rank === undefined) Object.assign(player, { rank: null });

  return {
    type: 'TRACK_SCORE_ADD_PLAYER',
    data: player,
  };
}

export function removePlayer(playerId) {
  return {
    type: 'TRACK_SCORE_REMOVE_PLAYER',
    data: playerId,
  };
}

export function setPlayerRank(id, rank) {
  return {
    type: 'TRACK_SCORE_UPDATE_PLAYER',
    data: { id, changes: { rank } },
  };
}

export function setPlayerScore(id, score) {
  return {
    type: 'TRACK_SCORE_UPDATE_PLAYER',
    data: { id, changes: { score } },
  };
}

export function setPlayerOrder(id, order) {
  return {
    type: 'TRACK_SCORE_UPDATE_PLAYER',
    data: { id, changes: { order } },
  };
}
