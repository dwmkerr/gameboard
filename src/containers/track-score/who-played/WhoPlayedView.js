import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import {
  Container,
  Content,
  Header,
  Icon,
  Item,
  Input,
  Left,
  List,
  ListItem,
  Separator,
  Text,
} from 'native-base';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ThumbnailLink from '@components/ui/ThumbnailLink';
import BigListItem from '@components/BigListItem';
import * as TrackScoreActions from '@redux/track-score/actions';

class WhoPlayed extends Component {
  static componentName = 'WhoPlayed';

  static propTypes = {
    friends: PropTypes.arrayOf(PropTypes.object).isRequired,
    players: PropTypes.arrayOf(PropTypes.object).isRequired,
    trackScoreAddPlayer: PropTypes.func.isRequired,
    trackScoreRemovePlayer: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  state = {
    searchText: null,
  }

  onCreateFriend = () => {
    Actions.CreateFriend({
      onCreateFriend: async (newFriend) => {
        const { uid } = firebase.auth().currentUser;
        firebase.firestore()
          .collection(`users/${uid}/friends`)
          .add(newFriend);
        Actions.pop();
      },
    });
  }

  onFindFriend = () => {
    Actions.LinkFriend({
      onPlayerSelected: async (foundFriend) => {
        const { uid } = firebase.auth().currentUser;
        firebase.firestore()
          .collection(`users/${uid}/friends`)
          .add(foundFriend);
        Actions.pop();
      },
    });
  }

  search = (searchText) => {
    this.setState({ ...this.state, searchText });
  }

  filterFriend = (friend) => {
    if (!this.state.searchText) return true;
    return friend.name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1;
  }

  renderPlayer = (player, selected) => {
    const icon = selected
      ? <Icon style={{ color: 'green' }} type="MaterialCommunityIcons" name="checkbox-marked-circle" />
      : <Icon style={{ color: '#cccccc' }} type="MaterialCommunityIcons" name="circle-outline" />;

    let action = selected
      ? () => this.props.trackScoreRemovePlayer(player.uid)
      : () => this.props.trackScoreAddPlayer(player);

    //  If the player is the current player, we have no icon
    //  and cannot select/deselect them.
    if (firebase.auth().currentUser.uid === player.uid) {
      action = null;
    }

    const leftContent = (<ThumbnailLink uri={player.imageUri} small />);
    return (
      <BigListItem
        key={player.uid}
        text={player.name}
        leftContent={leftContent}
        rightContent={icon}
        onPress={action}
        style={{ height: 54 }}
      />
    );
  }

  render = () => {
    const {
      friends,
      players,
    } = this.props;

    //  The available players to add to the game are our set of friends who are
    //  not yet already in the player list.
    const playerKeys = players.map(p => p.uid);
    const availableFriends = friends
      .filter(f => playerKeys.indexOf(f.uid) === -1)
      .filter(this.filterFriend);

    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              onChangeText={this.search}
              value={this.state.searchText}
            />
            <Icon name="ios-people" />
          </Item>
        </Header>
        <ScrollView>
          <Content>
            <List>
              <ListItem selected onPress={this.onFindFriend}>
                <Left>
                  <Text>Find Friend by Email</Text>
                </Left>
              </ListItem>
              <ListItem selected onPress={this.onCreateFriend}>
                <Left>
                  <Text>Create Friend</Text>
                </Left>
              </ListItem>
              <Separator bordered>
                <Text>Selected</Text>
              </Separator>
              { players.map(p => this.renderPlayer(p, true)) }
              <Separator bordered>
                <Text>Friends</Text>
              </Separator>
              { availableFriends.map(p => this.renderPlayer(p, false)) }
            </List>
          </Content>
        </ScrollView>
      </Container>
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
