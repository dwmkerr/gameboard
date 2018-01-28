import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import {
  Body,
  Button,
  Content,
  H1,
  Icon,
  List,
  ListItem,
  Right,
  Text,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';

import rankings from '@lib/rankings';
import { Spacer } from '@components/ui/';

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 30,
  },
});

class HistoryPlayedGame extends Component {
  static componentName = 'HistoryPlayedGame';

  static propTypes = {
    enableDelete: PropTypes.bool.isRequired,
    playedGame: PropTypes.shape({}).isRequired,
    gameStatsSetGame: PropTypes.func.isRequired,
    historyDeleteGame: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  deleteGame = (key) => {
    const del = () => {
      this.props.historyDeleteGame(key);
      Actions.pop();
    };

    Alert.alert(
      'Delete Game',
      'Are you sure you want to delete this game?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'OK', onPress: del },
      ],
    );
  }

  gameStats = (game) => {
    this.props.gameStatsSetGame(game);
    Actions.gameStats();
  }

  render = () => {
    const {
      enableDelete,
      playedGame: {
        game,
        key,
        createdAt,
        players,
      },
    } = this.props;

    //  Before we order by rank, fix any undefined ranks.
    const fixedPlayers = players.map(p => ({
      ...p,
      rank: (p.rank === undefined ? null : p.rank),
    }));

    //  Order the players by rank.
    const rankedPlayers = fixedPlayers.reduce((acc, player) => {
      acc[player.rank] = acc[player.rank] || [];
      acc[player.rank].push({ ...player });
      return acc;
    }, { });

    return (
      <Content style={styles.content}>
        <H1>{game}</H1>
        <Spacer size={10} />
        { createdAt && <Text>{moment.unix(createdAt / 1000).format('LLLL')}</Text>}
        <Spacer size={30} />
        <List>
          { Object.keys(rankedPlayers).map(key => (
            <View key={key}>
              <ListItem itemDivider>
                <Text>{rankings.rankName(key)}</Text>
              </ListItem>
              { rankedPlayers[key].map(player => (
                <ListItem key={player.id}>
                  <Body><Text>{player.name}</Text></Body>
                  <Right><Text>{player.score}</Text></Right>
                </ListItem>
              ))
              }
            </View>
          ))
          }
          <Spacer size={30} />
          <Button onPress={() => this.gameStats(game)}>
            <Text>{game} Stats</Text>
          </Button>
          <Spacer size={30} />
          { enableDelete &&
              <Button iconLeft danger onPress={() => this.deleteGame(key)}>
                <Icon name="trash" />
                <Text>Delete</Text>
              </Button>
          }
        </List>
      </Content>
    );
  }
}

export default HistoryPlayedGame;
