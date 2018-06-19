import firebase from 'react-native-firebase';
import React from 'react';
import {
  Actions,
  Router,
  Scene,
  Stack,
} from 'react-native-router-flux';
import { Button, Icon, Right, Text } from 'native-base';

import { AppConfig } from '@constants/';

// Scenes
import AddFriend from '@containers/add-friend/AddFriendContainer';
import Launch from '@containers/launch/LaunchView';
import Login from '@containers/login/LoginContainer';
import HistoryPlayedGame from '@containers/history/HistoryPlayedGame';
import Home from '@containers/home/HomeContainer';
import GameStats from '@containers/game-stats/GameStatsContainer';

import ChooseGame from '@containers/track-score/choose-game/ChooseGameView';
import WhoPlayed from '@containers/track-score/who-played/WhoPlayedView';
import WhoWon from '@containers/track-score/who-won/WhoWonView';
import AddScores from '@containers/track-score/add-scores/AddScoresView';

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

  //  Add the game.
  const playedGame = {
    ...store.getState().trackScore,
    scorerUid: uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  firebase.firestore()
    .collection('played-games')
    .add(playedGame);
}

const createRouter = store => (
  <Router>
    <Stack key="root">
      <Scene key="launch" component={Launch} hideNavBar initial />
      <Scene key="login" component={Login} hideNavBar />

      <Scene
        key="home"
        title={AppConfig.appName.toUpperCase()}
        component={Home}
        icon={() => <Icon name="home" />}
        renderRightButton={() => <Button transparent onPress={() => trackScore(store)}><Icon type="MaterialIcons" name="playlist-add" /></Button>}
        {...AppConfig.navbarProps}
      />

      <Scene
        key="chooseGame"
        title="SCORE: CHOOSE GAME"
        component={ChooseGame}
        {...AppConfig.navbarProps}

        onSelectGame={trackScoreSelectGame(store)}
      />

      <Scene
        key="whoPlayed"
        title="SCORE: PLAYERS"
        component={WhoPlayed}
        renderRightButton={() => <Right><Button transparent onPress={Actions.whoWon}><Text>Next</Text><Icon name="arrow-forward" /></Button></Right>}
        {...AppConfig.navbarProps}
      />

      <Scene
        key="whoWon"
        title="SCORE: WINNERS"
        component={WhoWon}
        renderRightButton={() => <Right><Button transparent onPress={Actions.addScores}><Text>Next</Text><Icon name="arrow-forward" /></Button></Right>}
        {...AppConfig.navbarProps}
      />

      <Scene
        key="addScores"
        title="SCORE: EXTRAS"
        component={AddScores}
        renderRightButton={() => <Right><Button transparent onPress={Actions.addScores}><Text>Done</Text><Icon name="arrow-forward" /></Button></Right>}
        onRight={() => { completeTrackScore(store); }}
        {...AppConfig.navbarProps}
      />

      <Scene
        key="gameStats"
        title="GAME STATS"
        component={GameStats}
        icon={() => <Icon name="stats" {...AppConfig.icons} />}
        {...AppConfig.navbarProps}
      />

      <Scene
        key="HistoryPlayedGame"
        title="HISTORY"
        component={HistoryPlayedGame}
        icon={() => <Icon name="stats" {...AppConfig.icons} />}
        {...AppConfig.navbarProps}
        clone
      />

      <Scene
        key="linkGame"
        title="SEARCH BGG"
        component={ChooseGame}
        {...AppConfig.navbarProps}
      />

      <Scene
        key="AddFriend"
        title="ADD FRIEND"
        component={AddFriend}
        icon={() => <Icon name="add" {...AppConfig.icons} />}
        {...AppConfig.navbarProps}
      />

      <Scene key="chooseGameModal" component={ChooseGame} />
    </Stack>
  </Router>
);

export default createRouter;
