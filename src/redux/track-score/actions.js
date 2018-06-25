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
    uid,
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
  if (!player.uid) Object.assign(player, { uid: (player.email || player.name) });
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

export function setPlayerRank(uid, rank) {
  return {
    type: 'TRACK_SCORE_UPDATE_PLAYER',
    data: { uid, changes: { rank } },
  };
}

export function setPlayerScore(uid, score) {
  return {
    type: 'TRACK_SCORE_UPDATE_PLAYER',
    data: { uid, changes: { score } },
  };
}

export function setPlayerOrder(uid, order) {
  return {
    type: 'TRACK_SCORE_UPDATE_PLAYER',
    data: { uid, changes: { order } },
  };
}
