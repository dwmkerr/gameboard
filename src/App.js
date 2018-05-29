//  Application root component.
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TestFairy from 'react-native-testfairy';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';

import * as LoginActions from '@redux/login/actions';
import * as GameStatsActions from '@redux/game-stats/actions';
import * as FriendsActions from '@redux/friends/actions';
import * as HistoryActions from '@redux/history/actions';


import store from './store';
import createRouter from './Router';

class App extends Component {
  constructor() {
    super();
    this.onAuthStateChangedUnsubscribe = null;
  }

  componentWillMount = () => {
    TestFairy.begin('eb518cbf74f80a4341651020de4c57fdad0749d0');
  }

  componentDidMount() {
    this.onAuthStateChangedUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      const { dispatch } = store;
      dispatch(LoginActions.setUser(user));

      //  If we have a user, we go to the home page, otherwise the login page.
      if (user) {
        Actions.home({ type: 'reset' });

        //  Load stats for Grifters for now...
        //  Also start watching online data.
        GameStatsActions.setGame('Grifters')(dispatch);
        FriendsActions.watchFriends()(dispatch);
        HistoryActions.watchHistory()(dispatch);
      } else {
        Actions.login({ type: 'reset' });
      }
    });
  }

  componentWillUnmount() {
    if (this.onAuthStateChangedUnsubscribe) {
      this.onAuthStateChangedUnsubscribe();
    }
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
