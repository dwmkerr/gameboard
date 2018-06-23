/* global __DEV__ */
export default {
  // App Details
  appName: 'GameBoard',

  // Build Configuration - eg. Debug or Release?
  DEV: __DEV__,

  // Google Analytics - uses a 'dev' account while we're testing
  gaTrackingId: (__DEV__) ? 'UA-111825291-4' : 'UA-111825291-1',

  //  TestFairy API Key.
  testFairyApiKey: 'eb518cbf74f80a4341651020de4c57fdad0749d0',

  //  Google Sign In iosClientId
  googleSignInIosClientId: '975841127237-1u0in83mi62uai9aao8l41vu2h9ca717.apps.googleusercontent.com',
};
