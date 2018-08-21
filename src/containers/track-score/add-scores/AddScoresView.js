import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Container,
  Content,
  Input,
  Item,
  List,
  ListItem,
  Separator,
  Text,
} from 'native-base';
import PropTypes from 'prop-types';

import BigListItem from '@components/BigListItem';
import ThumbnailLink from '@components/ui/ThumbnailLink';
import rankings from '@lib/rankings';
import * as TrackScoreActions from '@redux/track-score/actions';

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  listMiddle: {
    paddingLeft: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

//  Set a hex color, but add opacity. Useful for quickly checking layouts.
const col = val => (`#${val}00`);

class AddScores extends Component {
  static componentName = 'AddScore';

  static propTypes = {
    players: PropTypes.arrayOf(PropTypes.object).isRequired,
    trackScoreSetPlayerScore: PropTypes.func.isRequired,
    trackScoreSetPlayerOrder: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  componentWillReceiveProps() {
  }

  renderPlayerScore = (player) => {
    const leftContent = (
      <ThumbnailLink uri={player.imageUri} small />
    );
    const rightContent = (
      <Item regular>
        <Input
          regular
          style={{ backgroundColor: 'white', width: 32 }}
          keyboardType="numeric"
          placeholder="Score"
          onChangeText={text => this.props.trackScoreSetPlayerScore(player.uid, Number(text))}
        />
      </Item>
    );
    return (
      <BigListItem
        key={player.uid}
        leftContent={leftContent}
        rightContent={rightContent}
        rightStyle={{ flex: 1 }}
        text={player.name}
      />
    );
  }

  renderPlayerOrder = (player) => {
    const leftContent = (
      <ThumbnailLink uri={player.imageUri} small />
    );
    const rightContent = (
      <Item regular>
        <Input
          regular
          style={{ backgroundColor: 'white', width: 32 }}
          keyboardType="numeric"
          placeholder="Score"
          onChangeText={text => this.props.trackScoreSetPlayerOrder(player.uid, Number(text))}
        />
      </Item>
    );
    return (
      <BigListItem
        key={player.uid}
        leftContent={leftContent}
        rightContent={rightContent}
        rightStyle={{ flex: 1 }}
        text={player.name}
      />
    );
  }

  render = () => {
    const {
      players,
    } = this.props;

    const rankedPlayers = rankings.rankPlayers(players);

    return (
      <Container>
        <ScrollView>
          <Content>
            <List>
              <Separator bordered>
                <Text>Scores</Text>
              </Separator>
              <ListItem><Text>(Optional) add player scores below:</Text></ListItem>
              {rankedPlayers.map(this.renderPlayerScore)}
            </List>
            <List>
              <Separator bordered>
                <Text>Turn Order</Text>
              </Separator>
              <ListItem><Text>(Optional) add turn orders below:</Text></ListItem>
              {rankedPlayers.map(this.renderPlayerOrder)}
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
  trackScoreSetPlayerScore: TrackScoreActions.setPlayerScore,
  trackScoreSetPlayerOrder: TrackScoreActions.setPlayerOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddScores);
