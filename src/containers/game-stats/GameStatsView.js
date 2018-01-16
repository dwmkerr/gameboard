import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { H1, H2 } from 'native-base';

import { Spacer, WizardPage } from '@components/ui/';
import gameStats from '@lib/stats/game-stats';

const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
    marginTop: 30,
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    height: 30,
    lineHeight: 30,
    marginTop: 10,
    textAlign: 'center',
    width: 250,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    height: 37,
    width: 250,
  },

  statContainer: {
    flexDirection: 'row',
    flex: 1,
  },

  statName: {
    flex: 1,
    textAlign: 'right',
    padding: 8,
  },

  statValue: {
    flex: 1,
    textAlign: 'left',
    fontWeight: 'bold',
    padding: 8,
  },
});

class GameStats extends Component {
  static componentName = 'GameStats';

  static propTypes = {
    gameStats: PropTypes.shape({}).isRequired,
  }

  static defaultProps = {
  }

  componentWillReceiveProps() {
  }

  renderStat = ({ name, value }) => (
    <View style={styles.statContainer}>
      <Text style={styles.statName}>{name}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  )

  render = () => {
    const { gameStats: { game, playedGames } } = this.props;
    const stats = gameStats(playedGames);

    return (
      <View style={styles.tabContainer}>
        <WizardPage>
          <H1>{game} Stats</H1>
          <Spacer size={20} />
          <Text>Last played {stats.lastPlayed}</Text>
          <Spacer size={20} />
          <H2>Wins</H2>
          {this.renderStat({ name: 'Played', value: stats.played })}
          {this.renderStat({ name: 'Won', value: stats.won })}
          {this.renderStat({ name: 'Longest Streak', value: stats.longestStreak })}
          <Spacer size={20} />

          <H2>Score</H2>
          {this.renderStat({ name: 'Best', value: stats.bestScore })}
          {this.renderStat({ name: 'Average', value: stats.averageScore })}
          <Spacer size={20} />

          <H2>Nemesis</H2>
          {this.renderStat({ name: 'Beaten most by', value: stats.nemesisName })}
          {this.renderStat({ name: 'Beaten by Sarah', value: stats.nemesisWins })}
          {this.renderStat({ name: 'Beat Sarah', value: stats.nemesisBeat })}
          <Spacer size={20} />
          <Spacer size={20} />
        </WizardPage>
      </View>
    );
  }
}

export default GameStats;
