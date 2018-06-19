/**
 * Track Score Reducer
 */
import Store from './store';

// Set initial state
export const initialState = Store;

export default function trackScoreReducer(state = initialState, action) {
  switch (action.type) {
    case 'TRACK_SCORE_SET_GAME': {
      return {
        ...state,
        game: action.data,
      };
    }

    case 'TRACK_SCORE_START': {
      return {
        ...state,
        game: action.data.game,
        players: action.data.players,
      };
    }

    case 'TRACK_SCORE_ADD_PLAYER': {
      return {
        ...state,
        players: [...state.players, action.data],
      };
    }

    case 'TRACK_SCORE_REMOVE_PLAYER': {
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.data),
      };
    }

    case 'TRACK_SCORE_UPDATE_PLAYER': {
      const { id, changes } = action.data;

      return {
        ...state,
        players: state.players.map((p) => {
          if (p.id !== id) return p;
          return { ...p, ...changes };
        }),
      };
    }

    default:
      return state;
  }
}
