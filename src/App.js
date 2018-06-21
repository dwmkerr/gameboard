//  Application root component.
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TestFairy from 'react-native-testfairy';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';

import * as LoginActions from '@redux/login/actions';
import * as GamesActions from '@redux/games/actions';
import * as FriendsActions from '@redux/friends/actions';
import * as HistoryActions from '@redux/history/actions';
import * as UserActions from '@redux/user/actions';

import store from './store';
import createRouter from './Router';

class App extends Component {
  constructor() {
    super();

    //  These booleans track whether we have the data needed to actually run
    //  the main app.
    this.gamesReady = null;
    this.historyReady = null;
    this.friendsReady = null;

    //  This is an array of unsubscribe functions which will be called when the
    //  component is unmounted.
    this.unsubscribeFunctions = [];
  }

  componentWillMount = () => {
    TestFairy.begin('eb518cbf74f80a4341651020de4c57fdad0749d0');
  }

  componentDidMount() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      const { dispatch } = store;

      //  Update the state of the user, and update the user in the store.
      dispatch(LoginActions.setUser(user));
      if (!user) {
        Actions.login({ type: 'reset' });
      } else {
        //  TODO: game stats don't really work at the moment, so disabling them.
        //  Load stats for Grifters for now...
        //  Also start watching online data.
        // GameStatsActions.setGame('Grifters')(dispatch);
        this.watchCollections(user);
      }
    });
    this.unsubscribeFunctions.push(unsubscribe);
  }

  componentWillUnmount() {
    this.unsubscribeFunctions.forEach(u => u());
  }

  navigateIfRequired = () => {
    //  If we have loaded all data, we can go to the home page.
    if (this.gamesReady && this.historyReady && this.friendsReady) {
      Actions.home({ type: 'reset' });
    }
  }

  /**
   * This function starts watching the key Cloud Firestore and Real Time
   * database colelctions, updating the Redux store as needed.
   */
  watchCollections = (user) => {
    const { dispatch } = store;

    //  Get the games collection.
    const gamesRef = firebase.firestore().collection('games');
    const unsubscribe = gamesRef.onSnapshot((gamesSnapshot) => {
      const games = [];
      gamesSnapshot.forEach((game) => {
        const { name, thumbnailUrl } = game.data();
        games.push({
          key: game.id,
          name,
          thumbnailUrl,
        });
      });
      dispatch(GamesActions.updateGames(games));
      this.gamesReady = true;
      this.navigateIfRequired();
    }, (error) => {
      throw new Error(`An error occurred watching games: ${error.message}`);
    });
    this.unsubscribeFunctions.push(unsubscribe);

    //  Watch the user.
    firebase.firestore().collection('users').doc(user.uid).onSnapshot((doc) => {
      dispatch(UserActions.updateUser(doc.data()));
    });

    //  Watch the history for the user.
    firebase.firestore()
      .collection('played-games')
      .where('scorerUid', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .onSnapshot((snapshot) => {
        const playedGames = [];
        snapshot.forEach((child) => {
          const item = child.data();
          item.key = child.id;
          playedGames.push(item);
        });
        dispatch(HistoryActions.updateHistory(playedGames));
        this.historyReady = true;
        this.navigateIfRequired();
      }, (error) => {
        throw new Error(`An error occurred watching games: ${error.message}`);
      });

    //  Watch the friends for the user.
    firebase.firestore()
      .collection(`users/${user.uid}/friends`)
      .onSnapshot((snapshot) => {
        const friends = [];
        snapshot.forEach((child) => {
          const item = child.data();
          item.key = child.id;
          friends.push(item);
        });
        dispatch(FriendsActions.updateFriends(friends));
        this.friendsReady = true;
        this.navigateIfRequired();
      }, (error) => {
        throw new Error(`An error occurred watching games: ${error.message}`);
      });
  }

  render = () => {
    const router = createRouter(store);
    return (
      <Provider store={store}>
        {router}
      </Provider>
    );
  }
}

export default App;
