import React, { Component } from 'react';
import {
  View,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

import { AppStyles, AppSizes, AppColors } from '@theme/';
import log from '@lib/log';
import * as AuthCommands from '../../commands/auth';
import config from '../../config';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  background: {
    backgroundColor: AppColors.brand.primary,
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
  },
  logo: {
    width: AppSizes.screen.width * 0.85,
    resizeMode: 'contain',
  },
  whiteText: {
    color: '#FFF',
  },
});

/* Component ==================================================================== */
class Login extends Component {
  async componentDidMount() {
    //  Platform specific Google Signin configuration.
    if (Platform.OS === 'ios') {
      await GoogleSignin.configure({ iosClientId: config.googleSignInIosClientId });
    }

    if (Platform.OS === 'android') {
      //  Ensure we have Google Play Services available, prompting the user to
      //  install if needed. If we still fail, we cannot recover.
      try {
        await GoogleSignin.hasPlayServices();
      } catch (err) {
        console.log('Play services error', err.code, err.message);
        throw err;
      }

      //  Configure Sign In - the fields we want etc.
      await GoogleSignin.configure({ webClientId: config.googleSignInIosClientId });
    }
  }

  googleSignIn = async () => {
    //  Get the current user, which might already be available if we are already
    //  logged in. If the user is already signed in, we can store the user and
    //  we're done.
    try {
      const currentUser = await GoogleSignin.signInSilently();
      console.log('User already available!', currentUser);
      await AuthCommands.googleLogin(currentUser.idToken);
      return;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        //  We don't have a current user, so we need to sign in.
        try {
          const user = await GoogleSignin.signIn();
          console.log('User signed in!', user);
          await AuthCommands.googleLogin(user.idToken);
          return;
        } catch (err) {
          if (err.code === statusCodes.SIGN_IN_CANCELLED) {
            //  User cancelled the sign in flow, e.g. by dismissing the browser
            //  during the OAuth flow. We don't consider this to be an error.
          } else {
            //  Uh-oh, unknown error during sign in...
            log.error('Unknown error during sign in', err);
            throw err;
          }
        }
      } else {
        //  Uh-oh, unknown error during sign in...
        log.error('Unknown error during sign in', error);
        throw error;
      }
    }
  }

  render = () => (
    <View style={[AppStyles.containerCentered, AppStyles.container, styles.background]}>
      <Image
        source={require('../../images/logo.png')}
        style={[styles.logo]}
      />

      <GoogleSigninButton
        style={{ width: 312, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={this.googleSignIn}
      />
    </View>
  );
}

export default Login;
