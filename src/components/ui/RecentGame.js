import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {
  Body,
  Icon,
  Left,
  ListItem,
  Right,
  Text,
} from 'native-base';

import ThumbnailLink from '@components/ui/ThumbnailLink';
import config from '../../config';
import formatTimePlayed from '../../lib/time-played';

function renderWinners(players) {
  const winners = players.filter(p => p.rank === 1).map(p => p.name);
  switch (winners.length) {
    case 0:
      return (
        <Text note>No Winner!</Text>
      );
    case 1:
      return (
        <Text note>
          <Text note style={{ color: 'black', fontWeight: 'bold' }}>{winners[0]}</Text>
          <Text note style={{ color: 'black' }}> won</Text>
        </Text>
      );
    default:
      return (
        <Text note>
          <Text note style={{ color: 'black', fontWeight: 'bold' }}>{winners.join(', ')}</Text>
          <Text note style={{ color: 'black' }}> won</Text>
        </Text>
      );
  }
}

function renderStarter(players) {
  const starters = players.filter(p => p.order === 1).map(p => p.name);
  switch (starters.length) {
    case 0: return null;
    default: return (<Text note>{`${starters[0]} went first`}</Text>);
  }
}

const renderDebugNotes = (playedGame) => {
  const missingGameId = !playedGame.game.id;
  const missingPlayerIds = playedGame.players.some(p => !p.uid);
  const brokenTime = typeof playedGame.createdAt === 'number';
  return (
    <View>
      { missingGameId && <Text>The Game ID is missing</Text> }
      { missingPlayerIds && <Text>A Player ID is missing</Text> }
      { brokenTime && <Text>The timestamp is broken</Text> }
    </View>
  );
};

const renderRight = time => (
  <View style={{
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  >
    <Text style={{ alignSelf: 'flex-start', paddingRight: 8 }} note>{formatTimePlayed(time.toDate())}</Text>
    <Icon name="arrow-forward" />
  </View>
);

const RecentGame = (props) => {
  const {
    game,
    timePlayed,
    players,
    onPress,
  } = props;

  return (
    <ListItem
      avatar
      button
      onPress={onPress}
    >
      <Left>
        <ThumbnailLink uri={game.id ? `${config.apiRoot}/games/${game.id}/thumbnail` : null} />
      </Left>
      <Body>
        <Text>{game.name}</Text>
        {renderWinners(players)}
        {renderStarter(players)}
        {renderDebugNotes(props)}
      </Body>
      <Right>
        {!!timePlayed && renderRight(timePlayed)}
      </Right>
    </ListItem>
  );
};

RecentGame.propTypes = {
  game: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
    thumbnailUrl: PropTypes.string,
  }).isRequired,
  timePlayed: PropTypes.shape({}).isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPress: PropTypes.func,
};

RecentGame.defaultProps = {
  onPress: null,
};

export default RecentGame;
