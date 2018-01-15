//  Application root component.
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TestFairy from 'react-native-testfairy';

import store from './store';
import Router from './Router';

class App extends Component {
  componentWillMount = () => {
    TestFairy.begin('eb518cbf74f80a4341651020de4c57fdad0749d0');
  }

  render = () => (
    <Provider store={store}>
      {Router}
    </Provider>
  )
}

export default App;
