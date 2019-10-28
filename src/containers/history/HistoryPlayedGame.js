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
import ThumbnailLink from '@components/ui/ThumbnailLink';

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
    this.setState(s => ({ ...s, showDatePicker: false }));
  }

  editDate = () => {
    this.setState(s => ({ ...s, showDatePicker: true }));
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
    const del = async () => {
      await firebase.firestore()
        .collection('played-games')
        .doc(key)
        .delete();
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

  selectPlayerThumbnail = (player) => {
    const { playedGame } = this.props;
    //  Create the function we'll call when a player is selected.
    const onPlayerSelected = async (selectedPlayer) => {
      //  We're going to update the document. First, remove the old
      //  player uid from the playerIds, then add the new uid to the playerIds,
      //  then update the player details.
      const newPlayerIds = playedGame.playerIds.filter(p => p !== player);
      newPlayerIds.push(selectedPlayer.uid);

      const newPlayers = playedGame.players.filter(p => p !== player);
      newPlayers.push({
        ...player, // original fields, like rank and score and name...
        ...selectedPlayer, // overwritten with new player name, email, uid, image
      });
      await firebase.firestore()
        .collection('played-games')
        .doc(playedGame.key)
        .set({
          playerIds: newPlayerIds,
          players: newPlayers,
        }, { merge: true });
      Actions.pop();
    };

    Actions.LinkFriend({
      onPlayerSelected,
      searchText: player.email,
    });
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
        createdAt,
        key,
        game,
        players,
      },
    } = this.props;

    const { showDatePicker } = this.state;

    //  The 'createdAt' time is a Firebase timestamp. Switch it to a JS Date.
    const date = createdAt.toDate();

    //  Rank order the players.
    const rankedPlayers = rankings.rankPlayers(players);

    return (
      <Content style={styles.content}>
        <H1>{game.name}</H1>
        <Spacer size={10} />
        { this.renderDetail({ label: 'Game', value: game.name, onEdit: () => { this.editGame(key); } }) }
        { this.renderDetail({ label: 'Date', value: moment(date).format('LLL'), onEdit: () => { this.editDate(); } }) }
        <Spacer size={10} />
        <List>
          { rankedPlayers.map(p => (
            <ListItem key={p.uid} icon>
              <Left>
                <ThumbnailLink
                  uri={p.imageUri}
                  onPress={() => this.selectPlayerThumbnail(p)}
                  small
                />
              </Left>
              <Body>
                <Text>{p.name}</Text>
              </Body>
              <Right>
                <Badge rank={p.rank} />
                <Text>{p.score}</Text>
              </Right>
            </ListItem>
          ))
          }
        </List>

        <Spacer size={30} />
        { enableDelete &&
            (
              <Button block danger onPress={() => this.deleteGame(key)}>
                <Icon name="trash" />
                <Text>Delete</Text>
              </Button>
            )
        }

        <DateTimePicker
          mode="datetime"
          date={date}
          isVisible={showDatePicker}
          onConfirm={this.onSetDate}
          onCancel={() => { this.setState(s => ({ ...s, showDatePicker: false })); }}
        />
      </Content>
    );
  }
}

export default HistoryPlayedGame;
