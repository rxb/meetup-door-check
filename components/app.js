'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { connect } from 'react-redux';

//import Welcome from '../containers/welcome';
//import GroupList from '../containers/groupList';
import Scan from '../components/scan';
import ContextNavigator from '../components/contextNavigator';

// for deep linking
var qs = require('qs');


class App extends Component {

  render() {
    return (
      <ContextNavigator
        route={{
          initialRoute: {
              component: Scan
            /*
            component: Welcome,
            returnRoute: {
              component: GroupList
            }
            */
          }
        }}
        />
    );
  }
}

export default App;