import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';

// Components
import { Button, Content, List, Text } from 'native-base';
import { JumboButton, RecentGame, Spacer } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
  },
  background: {
    backgroundColor: AppColors.brand.primary,
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
  },
  logo: {
    width: AppSizes.screen.width * 0.85,
    resizeMode: 'contain',
  },
  whiteText: {
    color: '#FFF',
    textAlign: 'center',
  },
});

class Home extends Component {
  static componentName = 'Home';

  static propTypes = {
    trackScoreStart: PropTypes.func.isRequired,
    history: PropTypes.shape({ }).isRequired,
    logout: PropTypes.func.isRequired,
  }

  trackScore = async () => {
    //  Blat the state for the track score flow, then move to the screen.
    await this.props.trackScoreStart();
    Actions.trackScore();
  }

  render = () => {
    //  Get the current user id, users can only delete games they have scored.
    const { uid } = firebase.auth().currentUser;
    const { logout, history } = this.props;

    //  We only want the top three items.
    const recentGames = history.playedGames;

    return (
      <Content style={styles.content}>

        <List>
          {recentGames.map(pg => (
            <RecentGame
              key={pg.key}
              timePlayed={pg.createdAt}
              onPress={() => Actions.HistoryPlayedGame({
                enableDelete: pg.scorerUid === uid,
                playedGame: pg,
              })}
              players={pg.players}
              game={pg.game}
            />
          ))
          }
        </List>

        <Spacer size={10} />

        <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
          <View style={[AppStyles.flex1]}>
            <JumboButton
              title="History"
              subtitle="Log of all games"
              onPress={Actions.History}
            />
          </View>
        </View>

        <Spacer size={50} />

        <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
          <View style={[AppStyles.flex1]}>
            <Button onPress={logout} style={{ justifyContent: 'center', width: 120, alignSelf: 'center' }}>
              <Text style={styles.whiteText}>Logout</Text>
            </Button>
          </View>
        </View>
      </Content>
    );
  }
}

export default Home;
