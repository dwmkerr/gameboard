import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {
  Body,
  Container,
  Content,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Separator,
  Text,
} from 'native-base';
import PropTypes from 'prop-types';

import ThumbnailLink from '@components/ui/ThumbnailLink';
import rankings from '@lib/rankings';
import * as TrackScoreActions from '@redux/track-score/actions';

class WhoWon extends Component {
  static componentName = 'WhoWon';

  static propTypes = {
    players: PropTypes.arrayOf(PropTypes.object).isRequired,
    trackScoreSetPlayerRank: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  createMoveUpHandler = (player, nextAvailableRank) => () => {
    if (!Number.isInteger(player.rank)) {
      this.props.trackScoreSetPlayerRank(player.uid, nextAvailableRank);
    } else {
      this.props.trackScoreSetPlayerRank(player.uid, player.rank - 1);
    }
  }

  createMoveDownHandler = (player, nextAvailableRank) => () => {
    //  Is the player on the space ABOVE the next available rank? If so, then
    //  moving them down is going to skip that rank and make them a loser:
    //     1    - Winner       : Player 1     <--- move down from here goes to losers
    //     2    - Second Place : <empty, i.e. next available rank>
    //     null - Losers       : Player 2
    //  We also make the player a loser if they move down and the next available
    //  rank is ABOVE them, i.e:
    //     1    - Winner       : <empty, i.e. next available rank>
    //     2    - Second Place : Player 1     <--- move down from here goes to losers
    //     null - Losers       : Player 2
    if (player.rank === (nextAvailableRank - 1) || player.rank > nextAvailableRank) {
      this.props.trackScoreSetPlayerRank(player.uid, null);
    } else {
      this.props.trackScoreSetPlayerRank(player.uid, player.rank + 1);
    }
  }

  renderPlayer = (player, nextAvailableRank) => (
    <ListItem icon key={player.uid}>
      <Left>
        <ThumbnailLink uri={player.imageUri} small />
      </Left>
      <Body>
        <Text>{player.name}</Text>
      </Body>
      <Right>
        { player.rank !== null &&
        <TouchableOpacity
          transparent
          light
          onPress={this.createMoveDownHandler(player, nextAvailableRank)}
        >
          <Icon style={{ fontSize: 24, color: 'black' }} name="arrow-down-bold-circle-outline" type="MaterialCommunityIcons" />
        </TouchableOpacity>
        }
        { player.rank !== 1 &&
        <TouchableOpacity
          onPress={this.createMoveUpHandler(player, nextAvailableRank)}
        >
          <Icon style={{ fontSize: 24, color: 'black' }} name="arrow-up-bold-circle-outline" type="MaterialCommunityIcons" />
        </TouchableOpacity>
        }
      </Right>
    </ListItem>
  );

  renderPlayersOrHint(players, nextAvailableRank) {
    if (players && players.length > 0) {
      return players.map(player => this.renderPlayer(player, nextAvailableRank));
    }
    return (<ListItem><Text>Move players here with the up and down arrows</Text></ListItem>);
  }

  render = () => {
    const {
      players,
    } = this.props;

    //  Get the next available rank from the set of players.
    const nextAvailableRank = rankings.nextFreeRank(players);

    const rankedPlayers = players.reduce((acc, player) => {
      acc[player.rank] = acc[player.rank] || [];
      acc[player.rank].push({ ...player });
      return acc;
    }, { [nextAvailableRank]: [] }); // the next available rank is shown

    return (
      <Container>
        <ScrollView>
          <Content>
            <List>
              {
                Object.keys(rankedPlayers).map(key => (
                  <View key={key}>
                    <Separator bordered>
                      <Text>{rankings.rankName(key)}</Text>
                    </Separator>
                    {this.renderPlayersOrHint(rankedPlayers[key], nextAvailableRank)}
                  </View>
                ))
              }
            </List>
          </Content>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  game: state.trackScore.game,
  players: state.trackScore.players,
});

const mapDispatchToProps = {
  trackScoreSetPlayerRank: TrackScoreActions.setPlayerRank,
};

export default connect(mapStateToProps, mapDispatchToProps)(WhoWon);

