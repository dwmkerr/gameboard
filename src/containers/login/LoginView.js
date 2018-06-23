import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import log from '@lib/log';
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
  static componentName = 'Login';

  static propTypes = {
    googleLogin: PropTypes.func.isRequired,
  }

  async componentDidMount() {
    //  Platform specific Google Signin configuration.
    if (Platform.OS === 'ios') {
      await GoogleSignin.configure({ iosClientId: config.googleSignInIosClientId });
    }

    if (Platform.OS === 'android') {
      //  Ensure we have Google Play Services available, prompting the user to
      //  install if needed. If we still fail, we cannot recover.
      try {
        await GoogleSignin.hasPlayServices({ autoResolve: true });
      } catch (err) {
        console.log('Play services error', err.code, err.message);
        throw err;
      }

      //  Configure Sign In - the fields we want etc.
      await GoogleSignin.configure({ iosClientId: config.googleSignInIosClientId });
    }
  }

  googleSignIn = async () => {
    //  Get the current user, which might already be available if we are already
    //  logged in. If the user is already signed in, we can store the user and
    //  we're done.
    const currentUser = await GoogleSignin.currentUserAsync();
    if (currentUser) {
      console.log('User already available!', currentUser);
      await this.props.googleLogin(currentUser.idToken);
      Actions.home({ type: 'reset' });
      return;
    }

    //  We don't have a current user, so we need to sign in.
    try {
      const user = await GoogleSignin.signIn();
      console.log('User signed in!', user);
      await this.props.googleLogin(user.idToken);
      Actions.home({ type: 'reset' });
      return;
    } catch (err) {
      if (err.code === -5) {
        //  User cancelled the sign in flow, e.g. by dismissing the browser
        //  during the OAuth flow. We don't consider this to be an error.
      } else {
        //  Uh-oh, unknown error during sign in...
        log.error('Unknown error during sign in', err);
        throw err;
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
