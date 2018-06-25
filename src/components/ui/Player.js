import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Body, Card, CardItem, Text, Thumbnail } from 'native-base';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  playerCard: {
    borderRadius: 10,
  },

  playerCardItem: {
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bodyContainer: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8,
    alignSelf: 'center',
  },

  childrenContainer: {
    flex: 0,
    paddingRight: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
});

const Player = ({ player, hideIcon, children }) => (
  <Card key={player.uid} style={styles.playerCard}>
    <CardItem style={styles.playerCardItem}>
      { (!hideIcon) && <Thumbnail source={{ uri: player.imageUri }} style={{ flex: 0 }} /> }
      <Body style={styles.bodyContainer}>
        <Text>{player.name}</Text>
        <Text note>{player.email}</Text>
      </Body>
      <View style={styles.childrenContainer}>
        {children}
      </View>
    </CardItem>
  </Card>
);

Player.propTypes = {
  player: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    imageUri: PropTypes.string,
  }).isRequired,
  hideIcon: PropTypes.bool,
  children: PropTypes.node,
};

Player.defaultProps = {
  hideIcon: false,
  children: null,
};

export default Player;

