import firebase from 'react-native-firebase';
import * as FriendsActions from '@redux/friends/actions';
import * as HistoryActions from '@redux/history/actions';
import * as UserActions from '@redux/user/actions';

//  User-scoped firestore unscubscribe functions.
//  Mutable global scope, urgh.
let unsubscribeFunctions = [];

function snapshotToArray(snapshot) {
  //  Create the array of values, and include the item id as 'key'.
  const values = [];
  snapshot.forEach((child) => {
    values.push({ ...child.data(), key: child.id });
  });
  return values;
}

/**
 * startWatchingFirestore - this is a grotty function but here goes. Pass in a
 * firestore user and a dispatch function. This function will then start watching
 * the data the entire app cares about (user, games, friends), putting the data
 * into the store. Once the store has data, the promise returned by the function
 * resolves, with an array of unsubscribe functions.
 *
 * See 'App.js' for how this function is used and why it has a weird shape.
 *
 * @param user - the current firestore user.
 * @param dispatch - a redux dispatch function.
 * @returns - a promise which resolves when we have data for the user, games and
 * friends in the redux store.
 */
// eslint-disable-next-line
export function startWatchingFirestore(user, dispatch) {
  //  When the user changes, update the user state.
  const userReady = new Promise((resolve) => {
    const unsubscribe = firebase.firestore().collection('users').doc(user.uid).onSnapshot((doc) => {
      dispatch(UserActions.updateUser(doc.data()));
      resolve(unsubscribe);
    });
  });

  //  Watch the history for the user.
  const gamesReady = new Promise((resolve) => {
    const unsubscribe = firebase.firestore()
      .collection('played-games')
      .where('playerIds', 'array-contains', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .onSnapshot((snapshot) => {
        const playedGames = snapshotToArray(snapshot);
        playedGames.sort((a, b) => b.createdAt - a.createdAt);
        dispatch(HistoryActions.updateHistory(playedGames));
        resolve(unsubscribe);
      }, (error) => {
        throw new Error(`An error occurred watching games: ${error.message}`);
      });
  });

  //  Watch the friends for the user.
  const friendsReady = new Promise((resolve) => {
    const unsubscribe = firebase.firestore()
      .collection(`users/${user.uid}/friends`)
      .onSnapshot((snapshot) => {
        const friends = snapshotToArray(snapshot);
        dispatch(FriendsActions.updateFriends(friends));
        resolve(unsubscribe);
      }, (error) => {
        throw new Error(`An error occurred watching games: ${error.message}`);
      });
  });

  //  Resolve when we have got data at least once for each collection/doc.
  //  Resolve with the unsubscribe functions so that the caller can clean up
  //  later if they like.
  return Promise.all([userReady, gamesReady, friendsReady])
    .then((unsubscribers) => {
      //  Add each unsubscribe function to our global collection, so they can
      //  be cleaned up later.
      unsubscribers.forEach(u => unsubscribeFunctions.push(u));
    });
}

/**
 * stopWatchingFirestore - cleans up all watches regitered with startWatchingFirestore.
 * Should be called before logging out.
 */
export function stopWatchingFirestore() {
  unsubscribeFunctions.forEach(u => u());
  unsubscribeFunctions = [];
}
