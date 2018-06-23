import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Icon, Text } from 'native-base';

const badgeSize = 30;

const styles = StyleSheet.create({
  container: {
    width: badgeSize,
    height: badgeSize,
  },
  icon: {
    width: badgeSize,
    height: badgeSize,
    fontSize: badgeSize,
    fontWeight: 'bold',
  },
  labelContainer: {
    position: 'absolute',
    left: 11,
    top: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const rankColour = (rank) => {
  switch (rank) {
    case 1: return 'gold';
    case 2: return 'silver';
    case 3: return 'bronze';
    default: return '#dedede';
  }
};

const Badge = ({ rank }) => {
  const color = rankColour(rank);
  return (
    <View style={styles.container}>
      { !!rank && <View><Icon style={[styles.icon, { color }]} type="SimpleLineIcons" name="badge" /></View> }
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color }]}>{rank}</Text>
      </View>
    </View>
  );
};

Badge.propTypes = {
  rank: PropTypes.number.isRequired,
};

export default Badge;
