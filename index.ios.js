'use strict';

import App from './components/app';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

class peeps extends Component {

  render() {
    return (
        <App />
    );
  }
}


AppRegistry.registerComponent('peeps', () => peeps);
