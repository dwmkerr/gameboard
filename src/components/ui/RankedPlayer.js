/**
 * GameRankZone
 *   Shows a section for a rank, such as 'Winner', 'Second', 'Losers'.
 *
     <GameRankZone rank="Winner"></GameRankZone>
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  playerContainer: {
    backgroundColor: '#dedede',
    borderWidth: 1,
    borderColor: '#232323',
    borderRadius: 10,
    padding: 8,
  },

});

const RankedPlayer = ({ player, moveUp, moveDown }) => (
  <View style={styles.playerContainer} key={player.uid}>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        <Text>{player.name}</Text>
      </View>
      { moveDown &&
        <View style={{ flex: 0 }}>
          <Button
            transparent
            light
            onPress={moveDown}
          >
            <Icon name="arrow-dropdown" style={{ fontSize: 32, color: 'black' }} />
          </Button>
        </View>
      }
      { moveUp &&
      <View style={{ flex: 0 }}>
        <Button
          transparent
          light
          onPress={moveUp}
        >
          <Icon name="arrow-dropup" style={{ fontSize: 32, color: 'black' }} />
        </Button>
      </View>
      }
    </View>
  </View>
);

RankedPlayer.propTypes = {
  player: PropTypes.shape({}).isRequired,
  moveUp: PropTypes.func,
  moveDown: PropTypes.func,
};

RankedPlayer.defaultProps = {
  moveUp: null,
  moveDown: null,
};

export default RankedPlayer;
