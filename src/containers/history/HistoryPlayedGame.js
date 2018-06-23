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
  Left,
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
import Badge from '@components/ui/Badge';

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

  renderDetail = ({ label, value, onEdit }) => (
    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
      <View style={{ flex: 1 }}><Text style={{ color: '#ababab' }}>{label}</Text></View>
      <View style={{ flex: 4 }}><Text>{value}</Text></View>
      <View style={{ flex: 1 }}>
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

    //  Rank order the players.
    const rankedPlayers = rankings.rankPlayers(players);

    return (
      <Content style={styles.content}>
        <H1>{game.name}</H1>
        <Spacer size={10} />
        { this.renderDetail({ label: 'Game', value: game.name, onEdit: () => { this.editGame(key); } }) }
        { this.renderDetail({ label: 'Date', value: moment(createdAt).format('LLL'), onEdit: () => { this.editDate(); } }) }
        <Spacer size={10} />
        <List>
          { rankedPlayers.map(p => (
            <ListItem key={p.id} icon>
              <Left>
                { /* <Thumbnail source={require('../../images/unknown.png')} small /> */ }
                <Badge rank={p.rank} />
              </Left>
              <Body>
                <Text>{p.name}</Text>
              </Body>
              <Right><Text>{p.score}</Text></Right>
            </ListItem>
            ))
          }
        </List>

        <Spacer size={30} />
        { enableDelete &&
          <Button block danger onPress={() => this.deleteGame(key)}>
            <Icon name="trash" />
            <Text>Delete</Text>
          </Button>
        }

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
