import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Body, Icon, Left, ListItem, Right, Text, Thumbnail } from 'native-base';

function renderWinners(players) {
  const winners = players.filter(p => p.rank === 1).map(p => p.name);
  switch (winners.length) {
    case 0: return (<Text note>No Winner!</Text>);
    case 1: return (<Text note><Text note style={{ color: 'black', fontWeight: 'bold' }}>{winners[0]}</Text> won</Text>);
    default: return (<Text note>{winners.Join(', ')} won</Text>);
  }
}

function renderStarter(players) {
  const starters = players.filter(p => p.order === 1).map(p => p.name);
  switch (starters.length) {
    case 0: return null;
    default: return (<Text note>{starters[0]} went first</Text>);
  }
}

//  TODO: extract functions, unit tests for dates.
const renderTimePlayed = (timePlayed) => {
  if (!timePlayed) return null;
  const time = moment(timePlayed);
  const now = moment();
  const timeString = (t) => {
    const days = now.diff(t, 'days');
    const weeks = now.diff(t, 'weeks');
    if (days === 0) return t.format('LT'); // e.g. 8:30 PM
    else if (days === -1) return 'Yesterday';
    else if (weeks === 0) return t.format('ddd'); // e.g. Tue
    return t.format('D/M/YY'); // e.g 2016, Feb 3, 8:30 PM
  };
  return (
    <Text style={{ alignSelf: 'flex-start', paddingRight: 8 }} note>{timeString(time)}</Text>
  );
};

const renderRight = timePlayed => (
  <View style={{
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  >
    { renderTimePlayed(timePlayed)}
    <Icon name="arrow-forward" />
  </View>
);

const RecentGame = ({
  game,
  timePlayed,
  players,
  onPress,
}) => (
  <ListItem
    avatar
    button
    onPress={onPress}
  >
    <Left>
      <Thumbnail source={{ uri: `https://us-central1-gameboard-560d5.cloudfunctions.net/api/games/${game.id}/thumbnail` }} />
    </Left>
    <Body>
      <Text>{game.name}</Text>
      {renderWinners(players)}
      {renderStarter(players)}
    </Body>
    <Right>
      {renderRight(timePlayed)}
    </Right>
  </ListItem>
);

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
