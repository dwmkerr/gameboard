import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import firebase from 'react-native-firebase';
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
import DateTimePicker from 'react-native-modal-datetime-picker';
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
  }

  static defaultProps = {
  }

  state = {
    showDatePicker: false,
  };

  onSetDate = (date) => {
    const { playedGame: { key } } = this.props;
    //  Update the date of the document.
    firebase.firestore()
      .collection('played-games')
      .doc(key)
      .set({
        createdAt: date,
      }, { merge: true });
    this.setState({ ...this.state, showDatePicker: false });
  }

  editDate = () => {
    this.setState({ ...this.state, showDatePicker: true });
  }

  editGame = (key) => {
    Actions.push('chooseGameModal', {
      onSelectGame: (selectedGame) => {
        //  Now we need to update and link the game...
        firebase.firestore()
          .collection('played-games')
          .doc(key)
          .set({
            game: selectedGame,
          }, { merge: true });
        Actions.pop();
      },
    });
  }

  deleteGame = (key) => {
    const del = () => {
      firebase.firestore()
        .collection('played-games')
        .doc(key)
        .remove();
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
    Actions.gameStats({ game });
  }

  renderFixTimestamp = (key, game) => {
    //  Games which have a valid time as a timestamp don't need fixing.
    if (game.id) return null;

    return (
      <View>
        <Spacer size={10} />
        <Text>
          This game has a badly formatted timestamp, press the button below to
          fix it.
        </Text>
        <Button primary onPress={() => this.linkGame(key)}><Text>Link Now</Text></Button>
      </View>
    );
  }

  renderDetail = ({ label, value, onEdit }) => (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ }}><Text>{label}</Text></View>
      <View style={{ }}><Text>{value}</Text></View>
      <View style={{ }}>
        <Button transparent onPress={onEdit}>
          <Icon
            type="MaterialIcons"
            name="edit"
            style={{ fontSize: 20, color: 'black' }}
          />
        </Button>
      </View>
    </View>
  );

  render = () => {
    const {
      enableDelete,
      playedGame: {
        key,
        game,
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
        <H1>{game.name}</H1>
        <Spacer size={10} />
        { this.renderDetail({ label: 'Game', value: game.name, onEdit: () => { this.editGame(game.key); } }) }
        { this.renderDetail({ label: 'Date', value: moment(createdAt).format('LLL'), onEdit: () => { this.editDate(); } }) }
        <Spacer size={10} />
        <List>
          { Object.keys(rankedPlayers).map(playerKey => (
            <View key={playerKey}>
              <ListItem itemDivider>
                <Text>{rankings.rankName(playerKey)}</Text>
              </ListItem>
              { rankedPlayers[playerKey].map(player => (
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
            <Text>{game.name} Stats</Text>
          </Button>
          <Spacer size={30} />
          { enableDelete &&
            <Button iconLeft danger onPress={() => this.deleteGame(key)}>
              <Icon name="trash" />
              <Text>Delete</Text>
            </Button>
          }
        </List>
        <DateTimePicker
          mode="datetime"
          date={createdAt}
          isVisible={this.state.showDatePicker}
          onConfirm={this.onSetDate}
          onCancel={() => { this.setState({ ...this.state, showDatePicker: false }); }}
        />
      </Content>
    );
  }
}

export default HistoryPlayedGame;
