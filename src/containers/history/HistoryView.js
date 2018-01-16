import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Body, Content, Icon, Left, List, ListItem, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
  },

  // Tab Styles
  tabContainer: {
    flex: 1,
    marginTop: 30,
  },
});

class History extends Component {
  static componentName = 'GameStats';

  static propTypes = {
    history: PropTypes.shape({}).isRequired,
    gameStatsSetGame: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  render = () => {
    const { history, gameStatsSetGame } = this.props;
    (() => {})(history);

    return (
      <Content style={styles.content}>
        <List>
          {history.playedGames.map(pg => (
            <ListItem
              key={pg.key}
              button
              onPress={() => Actions.HistoryPlayedGame({
                playedGame: pg,
                gameStatsSetGame,
              })}
              icon
            >
              <Left>
                <Icon name="podium" />
              </Left>
              <Body>
                <Text>{pg.game}</Text>
              </Body>
              <Right>
                <Text>Details</Text>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          ))
          }
        </List>
      </Content>
    );
  }
}

export default History;
