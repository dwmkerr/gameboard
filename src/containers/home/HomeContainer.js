import { connect } from 'react-redux';

// Actions
import * as TrackScoreActions from '@redux/track-score/actions';

// The component we're mapping to
import HomeView from './HomeView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  history: state.history,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  trackScoreStart: TrackScoreActions.start,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
