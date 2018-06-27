import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'native-base';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#277df6',
    fontSize: 17,
    fontWeight: '600',
  },
  icon: {
    color: '#277df6',
    paddingTop: 3,
  },
});

const NavBarButton = (props) => {
  const {
    position,
    text,
    showIcon,
    iconType,
    iconName,
    iconSize,
    onPress,
  } = props;
  if (position === 'left') {
    return (
      <View>
        <TouchableOpacity
          style={styles.container}
          onPress={onPress}
        >
          <Icon
            style={[styles.icon, { fontSize: iconSize }]}
            type={iconType}
            name={iconName}
          />
          { text && <Text style={styles.text}>{text}</Text> }
        </TouchableOpacity>
      </View>
    );
  } else if (position === 'right') {
    return (
      <View>
        <TouchableOpacity
          style={styles.container}
          onPress={onPress}
        >
          { text && <Text style={styles.text}>{text}</Text> }
          { showIcon && <Icon
            style={[styles.icon, { fontSize: iconSize }]}
            type={iconType}
            name={iconName}
          /> }
        </TouchableOpacity>
      </View>
    );
  }
  return null;
};

NavBarButton.propTypes = {
  position: PropTypes.oneOf(['left', 'right']).isRequired,
  text: PropTypes.string,
  showIcon: PropTypes.bool.isRequired,
  iconType: PropTypes.string,
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  onPress: PropTypes.func.isRequired,
};

NavBarButton.defaultProps = {
  text: null,
  iconType: null,
  iconName: null,
  iconSize: null,
};

export const BackLeftButton = props => (
  <NavBarButton
    position="left"
    showIcon
    iconType="Ionicons"
    iconName="arrow-back"
    iconSize={34}
    onPress={Actions.pop}
    {...props}
  />
);

export const NextRightButton = props => (
  <NavBarButton
    position="right"
    text="Next"
    showIcon={false}
    iconType="Ionicons"
    iconName="arrow-forward"
    iconSize={34}
    {...props}
  />
);

export const MenuLeftButton = props => (
  <NavBarButton
    position="right"
    showIcon
    iconType="MaterialIcons"
    iconName="menu"
    iconSize={30}
    {...props}
  />
);

export const TrackScoreRightButton = props => (
  <NavBarButton
    position="right"
    showIcon
    iconType="MaterialCommunityIcons"
    iconName="playlist-plus"
    iconSize={24}
    {...props}
  />
);

export const TrackScoreDoneButton = props => (
  <NavBarButton
    position="right"
    showIcon={false}
    text="Done"
    iconType="MaterialCommunityIcons"
    iconName="playlist-check"
    iconSize={24}
    {...props}
  />
);
