import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, View } from 'react-native';
import {
  Container,
  H1,
  Input,
} from 'native-base';
import PropTypes from 'prop-types';

import { Player, Spacer } from '@components/ui/';
import rankings from '@lib/rankings';
import * as TrackScoreActions from '@redux/track-score/actions';

class AddScores extends Component {
  static componentName = 'AddScore';

  static propTypes = {
    game: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    players: PropTypes.arrayOf(PropTypes.object).isRequired,
    trackScoreSetPlayerScore: PropTypes.func.isRequired,
    trackScoreSetPlayerOrder: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  componentWillReceiveProps() {
  }

  renderPlayerScore = rankedPlayer => (
    <Player key={rankedPlayer.id} player={rankedPlayer} hideIcon>
      <View style={{ flex: 0, width: 80 }}>
        <Input
          regular
          keyboardType="numeric"
          placeholder="Score"
          onChangeText={text => this.props.trackScoreSetPlayerScore(rankedPlayer.id, text)}
        />
      </View>
    </Player>
  )

  renderPlayerOrder = rankedPlayer => (
    <Player key={rankedPlayer.id} player={rankedPlayer} hideIcon>
      <View style={{ flex: 0, width: 80 }}>
        <Input
          regular
          keyboardType="numeric"
          placeholder="Order"
          onChangeText={
            text => this.props.trackScoreSetPlayerOrder(rankedPlayer.id, Number.parseInt(text, 10))
          }
        />
      </View>
    </Player>
  )

  render = () => {
    const {
      game,
      players,
    } = this.props;

    const rankedPlayers = rankings.rankPlayers(players);

    return (
      <Container style={{ flex: 1, padding: 20 }}>
        <ScrollView>
          <H1>Add Scores for {game.name}?</H1>
          <Spacer size={20} />
          {rankedPlayers.map(this.renderPlayerScore)}
          <H1>Add Player Turn Order for {game.name}?</H1>
          <Spacer size={20} />
          {rankedPlayers.map(this.renderPlayerOrder)}
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
  trackScoreSetPlayerScore: TrackScoreActions.setPlayerScore,
  trackScoreSetPlayerOrder: TrackScoreActions.setPlayerOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddScores);
