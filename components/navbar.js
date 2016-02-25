'use strict';


var React = require('react-native');
var {
  PixelRatio,
  StatusBarIOS,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Navigator,
  View,
  Animated
} = React;


var fdn = require('react-native-foundation');
var swatches = require('meetup-swatches');
var NavigatorNavigationBarStyles = require('NavigatorNavigationBarStylesIOS');
var StaticContainer = require('StaticContainer.react');


function hasBackFromProps(props){
  var hasBack = ( 
      props && 
      props.belongsToNavigator !== false && 
      props.navigator.getCurrentRoutes && 
      props.navigator.getCurrentRoutes().length > 1
      );
  return hasBack;
}

var NavigationBarAction = React.createClass({
  getDefaultProps: function(){
    return{
      color: 'black'
    }
  },
  render: function(){
    return(
      <TouchableOpacity
        onPress={()=>{
          this.props.emitter.emit(this.props.event);
        }}
        >
        <View style={[ styles.actionButton ]}>
          { this.props.icon && 
            <Animated.Image 
              resizeMode="contain"
              style={[
                styles.actionIcon,
                {tintColor: this.props.color}
              ]} 
              source={{uri: this.props.icon}} 
              />
          }
          { !this.props.icon && 
            <Animated.Text 
              style={[
                fdn.text,
                {color: this.props.color}
              ]}>{this.props.label}</Animated.Text>
          }
        </View>
      </TouchableOpacity>
    );
  },
});


var NavigationBarBasic = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    route: React.PropTypes.object.isRequired,
    emitter: React.PropTypes.object.isRequired
  },

  componentDidMount: function(){
    this._listeners = [
      this.props.emitter.addListener('back', this.props.navigator.pop)
    ];
  },

  getDefaultProps: function(){
    return {
      belongsToNavigator: true,
      leftActions: [],
      rightActions: [],
      isTransparent: false,      
    }
  },

  getInitialState: function(){
    var thisStyle;

    // iOS
    if (this.props.isTransparent){
      thisStyle = {
        backgroundColor: 'transparent',
        actionColor: swatches.textPrimaryInverted,
        titleColor: swatches.textPrimaryInverted,
        borderBottomColor: 'transparent'
      }
    }
    else{
      thisStyle = {
        backgroundColor: swatches.navWhite,
        actionColor: swatches.red,
        titleColor: swatches.textPrimary,
        borderBottomColor: swatches.border
      }
    }

    return Object.assign({}, thisStyle);
  },

  componentWillUnmount: function() {
    this._listeners && this._listeners.forEach(listener => listener.remove());
  },

  _renderAction: function(a, i){
      return(
        <NavigationBarAction
          key={i}
          icon={a.icon}
          label={a.label}
          event={a.event}
          emitter={this.props.emitter}
          color={this.state.actionColor}
         />
      );
  },

  _renderActions: function(actions){
    return (
      <View style={[fdn.row, fdn.alignItemsCenter]}>
      { actions.map((a, i) => {
        if(a.static){
          return (
              <StaticContainer shouldUpdate={false} key={i}>
                <View>
                  {this._renderAction(a, i)}
                </View>
              </StaticContainer>
          );
        }
        else{
          return (this._renderAction(a, i));
        }
      })}
      </View>
    );
  },

  render: function(){
    var self = this;
    var backAction = (hasBackFromProps(this.props)) ? [{icon: 'left', label: 'back', event: 'back', static: true}] : [];
    return(
      <Animated.View style={[
        styles.navigationBar,
        {
          backgroundColor: this.state.backgroundColor,
          borderBottomColor: this.state.borderBottomColor
        }
      ]}>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            { this._renderActions( this.props.leftActions.concat(backAction) ) }
          </View>

          <Animated.View style={{flex: 1}}>
            {this.props.children}
          </Animated.View>
          
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            { this._renderActions(this.props.rightActions) }
          </View>
      </Animated.View>
    );
  },
  
});



var NavigationBar = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    route: React.PropTypes.object.isRequired,
    emitter: React.PropTypes.object.isRequired
  },

  getDefaultProps: function(){
    return {
      platform: 'ios'
    }
  },

getInitialState: function(){
    var thisStyle;

    // iOS
    if (this.props.isTransparent){
      thisStyle = {
        titleColor: swatches.textPrimaryInverted,
      }
    }
    else{
      thisStyle = {
        titleColor: swatches.textPrimary,
      }
    }

    return Object.assign({}, thisStyle);
  },

  _renderTitleComponent: function(){
    return(
      <Text 
        numberOfLines={1}
        style={[
          styles.navBarTitleText,
          {color: this.state.titleColor}
        ]}>
          {this.props.title}
      </Text>
    );
  },

  render: function(){
    return(
      <NavigationBarBasic
        navigator={this.props.navigator}
        route={this.props.route}
        emitter={this.props.emitter}
        belongsToNavigator={this.props.belongsToNavigator}
        isTransparent={this.props.isTransparent}
        platform={this.props.platform}
        leftActions={this.props.route.leftActions}
        rightActions={this.props.route.actions}
        >
        {this._renderTitleComponent()}
      </NavigationBarBasic>
      );
  },
  
});


var styles = {
  navigationBar: {
    height: NavigatorNavigationBarStyles.General.TotalNavHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, 
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: 8,
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1
  },
  navBarTitleText: {
    textAlign: 'center',
    fontWeight: '700',
    color: swatches.textPrimary,
    backgroundColor: 'transparent',
    fontSize: 17
  },
  navigationBarTransparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0
  },
  navigationActionTransparent: {
    tintColor: swatches.textPrimaryInverted,
  },
  actionIcon: {
    height: 24,
    width: 24,
    backgroundColor: 'transparent'
  },
  actionButton: {
    padding: 8,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
};

var stylesIOS = {
  navigationBar: {
    //backgroundColor: swatches.white
  },
  navBarTitleText: {
    textAlign: 'center',
    fontWeight: '700',
    color: swatches.textPrimary,
    marginTop: 30,
    marginHorizontal: 30,
    paddingHorizontal: 16,
    backgroundColor: 'transparent'
  },
 
  actionIcon: {
    tintColor: swatches.red,
  },
  navigationActionNormal: {
    shadowOpacity: 0,
    tintColor: swatches.red,
  },
  navigationBarNormal: {
    backgroundColor: '#fefefe',
    borderBottomWidth: 1,
    borderBottomColor: swatches.border
  },
};

var stylesAndroid = {
  navigationBar: {
    backgroundColor: swatches.red
  },
  navBarTitleText: {
    textAlign: 'left',
    marginTop: 30,
    marginLeft: 30,
    paddingHorizontal: 16,
    color: swatches.textPrimaryInverted,
  },

  actionIcon: {
    tintColor: swatches.textPrimaryInverted,
  },
  navigationActionNormal: {
    shadowOpacity: 0,
    tintColor: swatches.textPrimaryInverted,
  },
  navigationBarNormal: {
    backgroundColor: swatches.red
  },
};

module.exports = {
  NavigationBar,
  NavigationBarBasic,
  NavigationBarAction,
  NavigationBarAccessory: {}
};
