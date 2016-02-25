/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Component,
  Navigator,
  Image,
  Text,
  TouchableOpacity,
  View
} = React;

var _ = require('underscore')._;
var fdn = require('react-native-foundation');
var swatches = require('meetup-swatches');
var ComponentWithNav = require('./componentWithNav.ios')
var NavigatorNavigationBarStyles = require('NavigatorNavigationBarStylesIOS');


// Scene Config
var Dimensions = require('Dimensions');
var PixelRatio = require('PixelRatio');
var buildStyleInterpolator = require('buildStyleInterpolator');
var FlatFloatFromRight = Object.assign({}, Navigator.SceneConfigs.FloatFromRight);
var FlatFadeToTheLeft = {
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: -Math.round(Dimensions.get('window').width * 0.3), y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  opacity: {
    from: 1,
    to: 0.3,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100,
  },
  translateX: {
    from: 0,
    to: -Math.round(Dimensions.get('window').width * 0.3),
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
};
FlatFloatFromRight.animationInterpolators.out = buildStyleInterpolator(FlatFadeToTheLeft);



var ContextNavigator = React.createClass({

  componentDidMount: function(){
    var self = this;
  },

  renderScene: function(route, navigator) {
    return (
      <ComponentWithNav 
        route={route}
        navigator={navigator}
        topNavigator={this.props.topNavigator || navigator}
        />
    );
    
  },

  render: function() {
    return (
      <Navigator
        sceneStyle={fdn.container}
        ref={(navigator) => { this.navigator = navigator; }}
        renderScene={this.renderScene}
        configureScene={(route) => ({
          ...route.sceneConfig || FlatFloatFromRight,
        })}
        initialRoute={this.props.route.initialRoute}
        />
    );
  },

});




module.exports = ContextNavigator;