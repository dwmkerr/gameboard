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
import { Body, Button, Left, List, ListItem, Icon, Right, Text } from 'native-base';
import { JumboButton, Spacer } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
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
    const recentGames = history.playedGames.slice(0, 3);

    return (
      <View style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>


        <List>
          {recentGames.map(pg => (
            <ListItem
              key={pg.key}
              button
              onPress={() => Actions.HistoryPlayedGame({
                enableDelete: pg.scorerUid === uid,
                playedGame: pg,
              })}
              icon
            >
              <Left>
                <Icon name="podium" />
              </Left>
              <Body>
                <Text>{pg.game}</Text>
              </Body>
              <Right>
                <Text>Details</Text>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          ))
          }
        </List>

        <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
          <View style={[AppStyles.flex1]}>
            <JumboButton
              title="Track Score"
              subtitle="Record the result of a game"
              onPress={this.trackScore}
            />
          </View>
        </View>

        <Spacer size={10} />

        <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
          <View style={[AppStyles.flex1]}>
            <JumboButton
              title="Game Stats"
              subtitle="Who da best?"
              onPress={Actions.gameStats}
            />
          </View>
        </View>

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
      </View>
    );
  }
}

export default Home;
