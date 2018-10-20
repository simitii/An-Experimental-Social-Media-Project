import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  TextInput,
  Alert,
  Dimensions,
  Modal,
  TouchableHighlight
} from 'react-native';
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { Hoshi } from 'react-native-textinput-effects';
var Background = require('./Background');
export default class SettingThing extends Component{
  constructor(props) {
  super(props);
  this.state = {text: '',
  modalVisible: false,
  modalVisible1:true,};
}

  render(){
    return(
      <View style={{width:width*48/50,alignSelf:'center'}}>
      <Hoshi
style={{ backgroundColor: '#0097a7',}}
label={this.props.label}
iconClass={MaterialsIcon}
iconName={'directions-bus'}
iconColor={'#f4d29a'}
maxLength={this.props.maxLength}
secureTextEntry={this.props.secureTextEntry}
borderColor={'#e7e7e7'}
labelStyle={{ color: '#e7e7e7' ,fontSize:width/18}}
inputStyle={{ color: '#e7e7e7' ,fontSize:width/16}}
onChangeText={this.props.onChangeText}
value={this.props.value}
defaultValue={this.props.defaultValue}
keyboardType={this.props.keyboardType}
/>
</View>
    );
  }
}
var styles=StyleSheet.create({

});
module.exports=SettingThing;
