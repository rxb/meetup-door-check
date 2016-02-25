'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ProgressBarAndroid,
  ActivityIndicatorIOS,
  VibrationIOS,
  Animated
} from 'react-native';

import { connect } from 'react-redux';
import fdn from 'react-native-foundation';
import swatches from 'meetup-swatches';
import Camera from 'react-native-camera';
import AudioPlayer from 'react-native-audioplayer';

// api setup
var gimme = require('gimme');
gimme.apiKey = "i8ofuea4hi35ro573qeck6j15d";

// animation offset
const personTranslateYStart = 100;

class Scan extends Component {
  
  static routeDefaults = {
    name: 'Check in',
    navigationBarCustom: false,   
  };

  constructor(props){
    super(props);
    this.state = {
      currentLookup: null,
      showLookup: false,
      personTranslateY: new Animated.Value(personTranslateYStart),
      personOpacity: new Animated.Value(0),
      cardOpacity: new Animated.Value(0),
      cardColor: new Animated.Value('rgba(0,0,0,.8)')
    }
  }

  _lookupCodeValue(codeValue){
    fetch(`https://api.meetup.com/2/members?key=715d68731b3913292f447f4c45547&photo-host=public&member_id=${codeValue}`)
      .then((response) => {
        return response.json()
      })
      .then((json)=>{
        var data = json.results;
        var currentLookup = {found: false, allowed: false, user: {}};
        if(data && data.length){
          currentLookup = {
            found: true,
            allowed: true,
            user: data[0],
          }
        }

        // reject mcurtes 
        if(codeValue==183340889){
          currentLookup.allowed = false;
        }

        this.setState({currentLookup});
      });
  }

  _revealModal(){
    this.state.cardOpacity.setValue(1);
    Animated.sequence([
      Animated.timing(this.state.cardColor, {
        toValue: 'rgba(255,255,255, .5)',
        duration: 0,
      }),
      Animated.timing(this.state.cardColor, {
        toValue: 'rgba(0,0,0,.8)',
        duration: 0,
        delay: 20
      })
    ]).start();
  }

  _revealPerson(){
    this.state.personOpacity.setValue(0);
    this.state.personTranslateY.setValue(personTranslateYStart);
    Animated.parallel([
      Animated.spring(this.state.personTranslateY, {
        toValue: 0,
        tension: 80
      }),
      Animated.timing(this.state.personOpacity, {
        toValue: 1,
        duration: 200
      })
    ]).start();
  }

  _hideModal(){
    Animated.stagger(150,[
      Animated.parallel([
        Animated.spring(this.state.personTranslateY, {
          toValue: personTranslateYStart*-1,
          tension: 80
        }),
        Animated.timing(this.state.personOpacity, {
          toValue: 0,
          duration: 200
        })
      ]),
      Animated.timing(this.state.cardOpacity, {
        toValue: 0,
        duration: 200
      })
    ]).start(()=>{
      this.setState({
        showLookup: false,
        currentLookup: null
      })
    });
  }

  _onBarCodeRead(event){
    if(!this.state.showLookup){
      VibrationIOS.vibrate();
      AudioPlayer.play('Aurora.mp3');
      console.log(event);
      this._lookupCodeValue(event.data);
      this.setState({
        showLookup: true,
        currentLookup: null
      });      
    }
  }

  _dismissModal(){
    this._hideModal();
  }

  componentDidUpdate(prevProps, prevState){
    if(!prevState.showLookup && this.state.showLookup){
      this._revealModal(true);
    }
    if(prevState.showLookup && !this.state.showLookup){
      this._revealModal(false);
      this._revealPerson(false);
    }
    if(!prevState.currentLookup && this.state.currentLookup){
      this._revealPerson(true);
    }
  }

  render() {
    var yesImg = require('../assets/yes.png');
    var noImg = require('../assets/no.png');

    return (
      <View style={[fdn.container]}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          onBarCodeRead={ this._onBarCodeRead.bind(this)}
          style={[
            fdn.container, {
              flex: 1, 
            }
          ]}
          aspect={Camera.constants.Aspect.Fill}>

          <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,.8)', padding: 16}}>
            <Text style={[fdn.text, fdn.textSecondaryInverted, fdn.textAlignCenter]}>Scan barcode</Text>
          </View>

          {this.state.showLookup && 
            <Animated.View style={{
              flex: 1,
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: this.state.cardColor,
              opacity: this.state.cardOpacity,
              justifyContent: 'center'
            }}>

                {! this.state.currentLookup &&
                  <ActivityIndicatorIOS />
                }

                { this.state.currentLookup &&
                <TouchableOpacity onPress={this._dismissModal.bind(this)}>
                  <Animated.View style={{
                    transform: [
                      {translateY: this.state.personTranslateY}
                    ],
                    opacity: this.state.personOpacity,
                    alignItems: 'center',
                    flex: 0
                  }}>
                      <Image 
                        style={{
                          height: 200,
                          width: 200,
                          borderRadius: 100,
                          backgroundColor: 'rgba(255,255,255,1)',
                          padding: 16,
                          justifyContent: 'center',
                          alignItems: 'center',
                          resizeMode: 'cover',
                          borderWidth: 8,
                          borderColor: 'white'
                        }}
                        source={{uri: (this.state.currentLookup && this.state.currentLookup.user.photo) ? this.state.currentLookup.user.photo.photo_link : ''}}
                        />
                      <Text style={[fdn.text, fdn.textDisplay, fdn.textBold, fdn.textPrimaryInverted, fdn.textAlignCenter, {marginTop: 24, marginBottom: 10}]}>
                        {(this.state.currentLookup) ? this.state.currentLookup.user.name : ''}
                      </Text>
                      <View style={[fdn.row, {alignItems: 'center', backgroundColor: (this.state.currentLookup.allowed) ? 'green' : 'red', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 4}]}>
                        <View style={[fdn.rowItemShrink]}>
                        <Image 
                          style={{
                            height: 20,
                            width: 20,
                            tintColor: 'white',
                            marginRight: 6
                          }}
                          source={(this.state.currentLookup.allowed) ? yesImg : noImg}
                          />
                        </View>
                        <View style={[fdn.rowItemGrow]}>
                          <Text style={[fdn.text, fdn.textPrimaryInverted]}>{(this.state.currentLookup.allowed) ? 'Welcome!' : 'Not RSVPd'}</Text>
                        </View>
                      </View>
                  </Animated.View>
                </TouchableOpacity>
              }
            </Animated.View>
          }
        </Camera>
      </View>
    );
  }
}

export default Scan;