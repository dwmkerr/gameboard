import firebase from 'react-native-firebase';

export const start = () => async (dispatch) => {
  //  When we start tracking the score for a game, we'll create an initial set
  //  of players which include the current user.
  const {
    uid,
    displayName,
    email,
    photoURL,
  } = firebase.auth().currentUser;

  //  Get the last played game.
  const lastGame = await firebase.database().ref(`/users/${uid}`).once('value');
  const lastGameName = (lastGame.val() && lastGame.val().lastTrackedGameName) || '';

  const initialPlayers = [{
    id: uid,
    name: displayName,
    email,
    imageUri: photoURL,
    rank: null,
  }];

  return dispatch({
    type: 'TRACK_SCORE_START',
    data: {
      game: lastGameName,
      players: initialPlayers,
    },
  });
};

export function submit(gameResult) {
  const { uid } = firebase.auth().currentUser;

  const playedGame = {
    ...gameResult,
    scorerUid: uid,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
  };
  firebase.database()
    .ref('played-games')
    .push(playedGame);

  //  Update the last tracked game - which means we'll default to this next
  //  time.
  firebase.database()
    .ref(`/users/${uid}`)
    .update({
      lastTrackedGameName: gameResult.game,
    });

  return {
    type: 'TRACK_SCORE_SUBMIT',
    playedGame,
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
