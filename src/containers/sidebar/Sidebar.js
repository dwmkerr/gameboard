import React from 'react';
import { AsyncStorage, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';

//  TODO: would be better placed into some dedicated logic.
const logout = async () => {
  await AsyncStorage.removeItem('login/credentials');
  await firebase.auth().signOut();
  await GoogleSignin.signOut();
};

const sidebar = () => (
  <View style={{ padding: 40 }}>
    <Button block light onPress={logout}>
      <Icon type="MaterialCommunityIcons" name="logout" />
      <Text>Logout</Text>
    </Button>
  </View>
);

export default sidebar;
