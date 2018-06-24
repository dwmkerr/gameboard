//  Application root component.
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TestFairy from 'react-native-testfairy';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';

import * as LoginActions from '@redux/login/actions';
import * as FriendsActions from '@redux/friends/actions';
import * as HistoryActions from '@redux/history/actions';
import * as UserActions from '@redux/user/actions';

import config from './config';
import store from './store';
import createRouter from './Router';

class App extends Component {
  constructor() {
    super();

    //  These booleans track whether we have the data needed to actually run
    //  the main app.
    this.historyReady = null;
    this.friendsReady = null;

    //  This is an array of unsubscribe functions which will be called when the
    //  component is unmounted.
    this.unsubscribeFunctions = [];
  }

  componentWillMount = () => {
    TestFairy.begin(config.testFairyApiKey);
  }

  componentDidMount() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      const { dispatch } = store;

      //  Update the state of the user, and update the user in the store.
      dispatch(LoginActions.setUser(user));
      if (!user) {
        Actions.login({ type: 'reset' });
      } else {
        //  Track the user in GA.
        firebase.analytics().setUserId(user.uid);
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
    if (this.historyReady && this.friendsReady) {
      Actions.home({ type: 'reset' });
    }
  }

  /**
   * This function starts watching the key Cloud Firestore and Real Time
   * database colelctions, updating the Redux store as needed.
   */
  watchCollections = (user) => {
    const { dispatch } = store;

    //  Watch the user.
    firebase.firestore().collection('users').doc(user.uid).onSnapshot((doc) => {
      dispatch(UserActions.updateUser(doc.data()));
    });

    //  Watch the history for the user.
    firebase.firestore()
      .collection('played-games')
      .where(`playerIds.${user.uid}`, '==', true)
      // .orderBy('createdAt', 'desc')
      // .limit(20)
      .onSnapshot((snapshot) => {
        const playedGames = [];
        snapshot.forEach((child) => {
          const item = child.data();
          item.key = child.id;
          playedGames.push(item);
        });

        playedGames.sort((a, b) => b.createdAt - a.createdAt);

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
