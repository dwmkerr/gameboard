/**
 * Combine All Reducers
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// Our custom reducers
import friends from '@redux/friends/reducer';
import login from '@redux/login/reducer';
import games from '@redux/games/reducer';
import gameStats from '@redux/game-stats/reducer';
import history from '@redux/history/reducer';
import router from '@redux/router/reducer';
import sideMenu from '@redux/sidemenu/reducer';
import trackScore from '@redux/track-score/reducer';
import user from '@redux/user/reducer';

// Combine all
const appReducer = combineReducers({
  friends,
  login,
  games,
  gameStats,
  history,
  router,
  sideMenu,
  form: formReducer,
  trackScore,
  user,
});

// Setup root reducer
const rootReducer = (state, action) => {
  const newState = (action.type === 'RESET') ? undefined : state;
  return appReducer(newState, action);
};

export default rootReducer;
