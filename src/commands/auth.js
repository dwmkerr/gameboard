import { AsyncStorage } from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';

export const googleLogin = async (idToken) => {
  //  Create a google credential from the id token.
  const credential = firebase.auth.GoogleAuthProvider.credential(idToken);

  //  Now sign in with the google credential.
  try {
    await firebase.auth().signInWithCredential(credential);
  } catch (error) {
    const {
      errorCode,
    } = error;
    if (errorCode === 'auth/account-exists-with-different-credential') {
      // Email already associated with another account.
    }
    console.error('Firebase login error', error);
  }

  //  Awesome, we've logged in with Google + Firebase. Store the token for
  //  auto-login next time and dispatch success.
  await AsyncStorage.setItem('login/credentials', JSON.stringify({
    type: 'google',
    token: idToken,
  }));
};

export const logout = async () => {
  await AsyncStorage.removeItem('login/credentials');
  await firebase.auth().signOut();
  await GoogleSignin.signOut();
};
