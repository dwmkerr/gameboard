/*
 * Track Score View
 *  - Contains a multi-screen form to let the user track the score for a game.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

// Containers
import WhatGame from './WhatGameView';
import WhoPlayed from './WhoPlayedContainer';
import WhoWon from './WhoWonContainer';
import AddScores from './AddScoresContainer';
import AllDone from './AllDoneView';

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
});

class TrackScore extends Component {
  static componentName = 'TrackScore';

  static propTypes = {
    trackScoreSubmit: PropTypes.func.isRequired,
    trackScoreSetGame: PropTypes.func.isRequired,
    gameStatsSetGame: PropTypes.func.isRequired,
    trackScore: PropTypes.shape({ }).isRequired,
    game: PropTypes.string.isRequired,
  }

  static defaultProps = {
  }

  constructor() {
    super();

    this.state = {
      page: 1,
    };
  }

  componentWillMount() {
    console.log("***track score view mount")

  }

  componentWillReceiveProps() {
  }

  onGameStats = (game) => {
    //  Set the game for game stats, then move to the game stats scene.
    this.props.gameStatsSetGame(game);
    Actions.gameStats({ type: 'replace' });
  }

  handleDone = () => {
    this.props.trackScoreSubmit(this.props.trackScore);
    this.setState({ done: true, game: this.props.game, page: null });
  }

  handleWhatGameNext = (game) => {
    this.props.trackScoreSetGame(game);
    this.nextPage();
  }

  previousPage = () => {
    this.setState({ page: this.state.page - 1 });
  }

  nextPage = () => {
    this.setState({ page: this.state.page + 1 });
  }

  render = () => {
    const { done, game, page } = this.state;

    return (
      <View style={styles.tabContainer}>
        { done === true &&
        <AllDone game={game} gameStatsHandler={this.onGameStats} />
        }
        { page === 1 &&
        <WhatGame
          game={this.props.game}
          onNext={this.handleWhatGameNext}
        />
        }
        { page === 2 &&
        <WhoPlayed
          onNext={this.nextPage}
          previousPage={this.previousPage}
        />
        }
        { page === 3 &&
        <WhoWon
          onNext={this.nextPage}
          previousPage={this.previousPage}
        />
        }
        { page === 4 &&
        <AddScores
          onNext={this.handleDone}
          previousPage={this.previousPage}
        />
        }
      </View>
    );
  }
}

export default TrackScore;
