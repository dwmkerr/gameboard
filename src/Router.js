import firebase from 'react-native-firebase';
import React from 'react';
import {
  Actions,
  Drawer,
  Reducer,
  Router,
  Scene,
} from 'react-native-router-flux';
import { Icon } from 'native-base';

// Scenes
import AddFriend from '@containers/add-friend/AddFriendContainer';
import Launch from '@containers/launch/Launch';
import Login from '@containers/login/Login';
import HistoryPlayedGame from '@containers/history/HistoryPlayedGame';
import Home from '@containers/home/HomeContainer';
import GameStats from '@containers/game-stats/GameStatsContainer';

import ChooseGame from '@containers/track-score/choose-game/ChooseGameView';
import WhoPlayed from '@containers/track-score/who-played/WhoPlayedView';
import WhoWon from '@containers/track-score/who-won/WhoWonView';
import AddScores from '@containers/track-score/add-scores/AddScoresView';
import LinkFriend from '@containers/link-friend/LinkFriend';
import CreateFriend from '@containers/create-friend/CreateFriend';

import Sidebar from '@containers/sidebar/Sidebar';
import {
  BackLeftButton,
  NextRightButton,
  TrackScoreDoneButton,
  TrackScoreRightButton,
} from '@components/NavBarButtons';

import * as TrackScoreActions from '@redux/track-score/actions';

async function trackScore(store) {
  store.dispatch(TrackScoreActions.start());
  Actions.chooseGame();
}

const trackScoreSelectGame = store => (game) => {
  //  Store the selected game in the track score state, then move to the next scene.
  store.dispatch(TrackScoreActions.setGame(game));
  Actions.whoPlayed();
};

async function completeTrackScore(store) {
  const { uid } = firebase.auth().currentUser;

  //  Get the tracked score from redux.
  const trackedGame = store.getState().trackScore;

  //  Create the map of player ids, only needed to support querying for firebase.
  const playerIds = trackedGame.players.reduce((acc, val) => ({
    ...acc,
    [val.uid]: true,
  }), {});

  //  Add the game.
  const playedGame = {
    ...trackedGame,
    playerIds,
    scorerUid: uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  firebase.firestore()
    .collection('played-games')
    .add(playedGame);
  Actions.home({ type: 'reset' });
}

const reducerCreate = (params) => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    console.log('ACTION:', action);
    return defaultReducer(state, action);
  };
};

const createRouter = store => (
  <Router
    createReducer={reducerCreate}
  >
    <Scene
      key="root"
      hideNavBar
    >
      <Scene key="launch" component={Launch} hideNavBar initial />
      <Scene key="login" component={Login} hideNavBar />

      <Drawer
        key="home"
        drawerIcon={<Icon style={{ fontSize: 24, color: '#277df6' }} type="MaterialIcons" name="menu" />}
        drawerWidth={260}
        contentComponent={Sidebar}
      >
        <Scene
          key="main"
        >

          <Scene
            title="GameBoard"
            component={Home}
            icon={() => <Icon name="home" />}
            renderRightButton={() => <TrackScoreRightButton onPress={() => trackScore(store)} />}
          />

          <Scene
            key="chooseGame"
            title="Score: Choose Game"
            component={ChooseGame}
            back
            renderBackButton={() => <BackLeftButton />}
            onSelectGame={trackScoreSelectGame(store)}
          />

          <Scene
            key="whoPlayed"
            title="Score: Players"
            component={WhoPlayed}
            back
            renderBackButton={() => <BackLeftButton />}
            renderRightButton={() => <NextRightButton onPress={Actions.whoWon} />}
          />

          <Scene
            key="whoWon"
            title="Score: Winners"
            component={WhoWon}
            back
            renderBackButton={() => <BackLeftButton />}
            renderRightButton={() => <NextRightButton onPress={Actions.addScores} />}
          />

          <Scene
            key="addScores"
            title="Score: Extras"
            component={AddScores}
            back
            renderBackButton={() => <BackLeftButton />}
            renderRightButton={() => (
              <TrackScoreDoneButton
                onPress={() => completeTrackScore(store)}
              />)}
          />

          <Scene
            key="gameStats"
            title="Game Stats"
            component={GameStats}
            back
            renderBackButton={() => <BackLeftButton />}
            icon={() => <Icon name="stats" />}
          />

          <Scene
            key="HistoryPlayedGame"
            title="History"
            component={HistoryPlayedGame}
            back
            renderBackButton={() => <BackLeftButton />}
            icon={() => <Icon name="stats" />}
            clone
          />

          <Scene
            key="LinkFriend"
            title="Link Friend by Email"
            back
            renderBackButton={() => <BackLeftButton />}
            component={LinkFriend}
          />

          <Scene
            key="linkGame"
            title="Search BGG"
            back
            renderBackButton={() => <BackLeftButton />}
            component={ChooseGame}
          />

          <Scene
            key="AddFriend"
            title="Add Friend"
            component={AddFriend}
            back
            renderBackButton={() => <BackLeftButton />}
            icon={() => <Icon name="add" />}
          />

          <Scene
            key="CreateFriend"
            title="Create Friend"
            component={CreateFriend}
            back
            renderBackButton={() => <BackLeftButton />}
            icon={() => <Icon name="add" />}
          />

          <Scene
            key="chooseGameModal"
            title="Choose Game"
            component={ChooseGame}
            back
            renderBackButton={() => <BackLeftButton />}
          />

        </Scene>

      </Drawer>
    </Scene>
  </Router>
);

export default createRouter;
