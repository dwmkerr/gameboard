/**
 * Add Scores View
 *  - Used to add scores (if wanted) to a tracked game.
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import { H1, Input } from 'native-base';
import PropTypes from 'prop-types';

import { Player, Spacer, WizardPage } from '@components/ui/';
import rankings from '@lib/rankings';

class AddScore extends Component {
  static componentName = 'AddScore';

  static propTypes = {
    onNext: PropTypes.func.isRequired,
    previousPage: PropTypes.func.isRequired,
    game: PropTypes.string.isRequired,
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
      onNext,
      previousPage,
      game,
      players,
    } = this.props;

    const rankedPlayers = rankings.rankPlayers(players);

    return (
      <WizardPage
        nextLabel="Done"
        previousLabel="Back"
        onNext={onNext}
        onPrevious={previousPage}
      >
        <H1>Add Scores for {game}?</H1>
        <Spacer size={20} />
        {rankedPlayers.map(this.renderPlayerScore)}
        <H1>Add Player Turn Order for {game}?</H1>
        <Spacer size={20} />
        {rankedPlayers.map(this.renderPlayerOrder)}
      </WizardPage>
    );
  }
}

export default AddScore;
