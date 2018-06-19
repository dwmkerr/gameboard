import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Container, H1 } from 'native-base';
import PropTypes from 'prop-types';

import { GameRankZone, Player, PlayerButton, Spacer } from '@components/ui/';
import rankings from '@lib/rankings';
import * as TrackScoreActions from '@redux/track-score/actions';

class WhoWon extends Component {
  static componentName = 'WhoWon';

  static propTypes = {
    game: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    players: PropTypes.arrayOf(PropTypes.object).isRequired,
    trackScoreSetPlayerRank: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  createMoveUpHandler = (player, nextAvailableRank) => () => {
    if (!Number.isInteger(player.rank)) {
      this.props.trackScoreSetPlayerRank(player.id, nextAvailableRank);
    } else {
      this.props.trackScoreSetPlayerRank(player.id, player.rank - 1);
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
      this.props.trackScoreSetPlayerRank(player.id, null);
    } else {
      this.props.trackScoreSetPlayerRank(player.id, player.rank + 1);
    }
  }

  render = () => {
    const {
      game,
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
      <Container style={{ flex: 1, padding: 20 }}>
        <ScrollView>
          <H1>Who Won {game.name}?</H1>
          <Spacer size={20} />
          {
            Object.keys(rankedPlayers).map(key => (
              <GameRankZone key={key} rank={rankings.rankName(key)}>
                {rankedPlayers[key].map(player => (
                  <Player key={player.id} player={player} hideIcon>
                    { player.rank !== null && <PlayerButton iconName="md-arrow-down" onPress={this.createMoveDownHandler(player, nextAvailableRank)} /> }
                    { player.rank !== 1 && <PlayerButton iconName="md-arrow-up" onPress={this.createMoveUpHandler(player, nextAvailableRank)} /> }
                  </Player>
                ))}
              </GameRankZone>
            ))
          }
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

