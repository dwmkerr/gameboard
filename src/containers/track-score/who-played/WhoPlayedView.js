import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  Button,
  Container,
  Content,
  H1,
  H2,
  Header,
  Icon,
  Input,
  List,
  ListItem,
  Text,
} from 'native-base';
import PropTypes from 'prop-types';
import { Player, PlayerButton, Spacer } from '@components/ui/';
import { connect } from 'react-redux';
import * as TrackScoreActions from '@redux/track-score/actions';

class WhoPlayed extends Component {
  static componentName = 'WhoPlayed';

  static propTypes = {
    friends: PropTypes.arrayOf(PropTypes.object).isRequired,
    players: PropTypes.arrayOf(PropTypes.object).isRequired,
    game: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    trackScoreAddPlayer: PropTypes.func.isRequired,
    trackScoreRemovePlayer: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  render = () => {
    const {
      game,
      friends,
      players,
    } = this.props;

    //  The available players to add to the game are our set of friends who are
    //  not yet already in the player list.
    const playerKeys = players.map(p => p.id);
    const availableFriends = friends.filter(f => playerKeys.indexOf(f.id) === -1);

    return (
      <View>
        <Container style={{ flex: 1, padding: 20 }}>
          <ScrollView>
            <H1>Who Played {game.name}?</H1>
            <Spacer size={20} />
            { players.map(player => (
              <Player key={player.id} player={player}>
                <PlayerButton
                  iconName="remove"
                  onPress={() => this.props.trackScoreRemovePlayer(player.id)}
                />
              </Player>
            ))
            }
            <Spacer size={10} />
            <H2>Friends</H2>
            { availableFriends.map(player => (
              <Player key={player.id} player={player}>
                <PlayerButton
                  iconName="add"
                  onPress={() => this.props.trackScoreAddPlayer(player)}
                />
              </Player>
            ))
            }
            <Spacer size={10} />
            <Button
              onPress={Actions.AddFriend}
              iconLeft
              block
              primary
            >
              <Icon name="add" />
              <Text>Add Friend</Text>
            </Button>
          </ScrollView>
        </Container>
      </View>
    );
  }
}

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  game: state.trackScore.game,
  players: state.trackScore.players,
  friends: state.friends.friends,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  trackScoreAddPlayer: TrackScoreActions.addPlayer,
  trackScoreRemovePlayer: TrackScoreActions.removePlayer,
};

export default connect(mapStateToProps, mapDispatchToProps)(WhoPlayed);
