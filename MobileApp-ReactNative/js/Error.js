import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
} from 'react-native';
import Button from 'apsl-react-native-button';

var Background = require('./Background');
var NavBar = require('./NavBar');
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;

export default class Error extends Component {
  render() {
    return (



      <View style={{width:width,top:height/11,paddingTop:height*0.28,paddingBottom:height,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',}}>
        {/*logo should come here*/}
        <Text style={{fontSize:25,textAlign:'center',color:'#e7e7e7',fontWeight:'bold'}}>{this.props.errorTitle}</Text>
        <Text style={{fontSize:18,textAlign:'center',color:'#e7e7e7',fontWeight:'bold'}}>{this.props.errorText}</Text>
        <View style={{alignItems: 'center'}}>
        <Button onPress={this.props.callback} style={{height:height/13,width:width/3,
          borderWidth: 0.7,borderRadius:15,borderColor:'#007bc7',backgroundColor:'#0097f7',margin:8}} textStyle={{color:'#e7e7e7',textAlign: 'center'}}>
          Tekrar Dene
        </Button>
        </View>
      </View>

    );
  }
}


module.exports = Error;
