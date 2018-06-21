import Store from './store';

// Set initial state
export const initialState = Store;

export default function friendsReducer(state = initialState, action) {
  switch (action.type) {
    case 'FRIENDS_UPDATE_FRIENDS': {
      return {
        ...state,
        friends: action.data,
      };
    }

    default:
      return state;
  }
}
