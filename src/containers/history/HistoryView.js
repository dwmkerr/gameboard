import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Body, Content, Icon, Left, List, ListItem, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
  },
});

class History extends Component {
  static componentName = 'GameStats';

  static propTypes = {
    history: PropTypes.shape({}).isRequired,
    gameStatsSetGame: PropTypes.func.isRequired,
    historyDeleteGame: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  render = () => {
    //  Get the current user id, users can only delete games they have scored.
    const { uid } = firebase.auth().currentUser;

    const {
      history,
      gameStatsSetGame,
      historyDeleteGame,
    } = this.props;
    (() => {})(history);

    return (
      <Content style={styles.content}>
        <List>
          {history.playedGames.map(pg => (
            <ListItem
              key={pg.key}
              button
              onPress={() => Actions.HistoryPlayedGame({
                enableDelete: pg.scorerUid === uid,
                playedGame: pg,
                gameStatsSetGame,
                historyDeleteGame,
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
      </Content>
    );
  }
}

export default History;
