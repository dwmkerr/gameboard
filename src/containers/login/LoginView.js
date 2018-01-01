/**
 * Authenticate Screen
 *  - Entry screen for all authentication
 *  - User can tap to login, forget password, signup...
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
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
      await GoogleSignin.configure({
        iosClientId: '975841127237-1u0in83mi62uai9aao8l41vu2h9ca717.apps.googleusercontent.com',
      });
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
      await GoogleSignin.configure({
        iosClientId: '975841127237-1u0in83mi62uai9aao8l41vu2h9ca717.apps.googleusercontent.com', // only for iOS
      });
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
      console.log('Sign in error', err.code, err.message);
      throw err;
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
