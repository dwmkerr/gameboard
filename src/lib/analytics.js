/**
 * Custom Redux Middleware to track Redux Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import firebase from 'react-native-firebase';
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
import { ActionConst } from 'react-native-router-flux';

// Consts and Libs
import config from '../config';

// Google Analytics
const GoogleAnalytics = new GoogleAnalyticsTracker(config.gaTrackingId);

const track = store => next => (action) => {
  // Track each screen view to Redux
  // - Requires that each Scene in RNRF have a 'analyticsDesc' prop
  //  Note: this is currently not firing, seemingly due to this issue:
  //    https://github.com/aksonov/react-native-router-flux/issues/2851
  switch (action.type) {
    case ActionConst.FOCUS:
      //  TODO: decide on a scene name policy here.
      if (action && action.scene && action.scene.analyticsDesc) {
        try {
          const screenName = (action.scene.title)
            ? `${action.scene.analyticsDesc} - ${action.scene.title}`
            : action.scene.analyticsDesc;

          // Send to Google Analytics
          firebase.analytics().setCurrentScreen(screenName, true);

          //  TODO: we can retire this, as well as react-native-google-analytics-bridge.
          GoogleAnalytics.trackScreenView(screenName);
        } catch (err) {
          console.log(store);
          console.log(err);
        }
      }
      break;

    default:
  }
  return next(action);
};

export default track;
