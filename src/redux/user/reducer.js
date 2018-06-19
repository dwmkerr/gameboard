import Store from './store';

export const initialState = Store;

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_UPDATE_USER': {
      return {
        ...state,
        ...action.data,
      };
    }

    case 'USER_UPDATE_FAVOURITE_GAMES': {
      return {
        ...state,
        favouriteGames: action.data,
      };
    }

    case 'USER_UPDATE_RECENT_GAMES': {
      return {
        ...state,
        recentGames: action.data,
      };
    }

    default:
      return state;
  }
}
