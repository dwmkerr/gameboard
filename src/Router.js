import firebase from 'react-native-firebase';
import React from 'react';
import {
  Actions,
  Router,
  Scene,
  Stack,
} from 'react-native-router-flux';
import { Button, Icon, Right, Text } from 'native-base';


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
        title="GameBoard"
        component={Home}
        icon={() => <Icon name="home" />}
        renderRightButton={() => <Button transparent onPress={() => trackScore(store)}><Icon type="MaterialIcons" name="playlist-add" /></Button>}
      />

      <Scene
        key="chooseGame"
        title="Score: Choose Game"
        component={ChooseGame}

        onSelectGame={trackScoreSelectGame(store)}
      />

      <Scene
        key="whoPlayed"
        title="Score: Players"
        component={WhoPlayed}
        renderRightButton={() => <Right><Button transparent onPress={Actions.whoWon}><Text>Next</Text><Icon name="arrow-forward" /></Button></Right>}
      />

      <Scene
        key="whoWon"
        title="Score: Winners"
        component={WhoWon}
        renderRightButton={() => <Right><Button transparent onPress={Actions.addScores}><Text>Next</Text><Icon name="arrow-forward" /></Button></Right>}
      />

      <Scene
        key="addScores"
        title="Score: Extras"
        component={AddScores}
        renderRightButton={() => <Right><Button transparent onPress={() => completeTrackScore(store)}><Text>Done</Text><Icon name="arrow-forward" /></Button></Right>}
      />

      <Scene
        key="gameStats"
        title="Game Stats"
        component={GameStats}
        icon={() => <Icon name="stats" />}
      />

      <Scene
        key="HistoryPlayedGame"
        title="History"
        component={HistoryPlayedGame}
        icon={() => <Icon name="stats" />}
        clone
      />

      <Scene
        key="linkGame"
        title="Search BGG"
        component={ChooseGame}
      />

      <Scene
        key="AddFriend"
        title="Add Friend"
        component={AddFriend}
        icon={() => <Icon name="add" />}
      />

      <Scene key="chooseGameModal" component={ChooseGame} />
    </Stack>
  </Router>
);

export default createRouter;
