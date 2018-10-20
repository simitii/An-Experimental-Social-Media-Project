import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

import Button from 'apsl-react-native-button'
import Foundation from 'react-native-vector-icons/Foundation'
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons'
import { Kohana } from 'react-native-textinput-effects'
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var SignupScene=require('./signupScene');
var Background = require('./Background');
var MainPageScene=require('./MainPageScene');
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;
export default class ForgotPassword extends Component{
  constructor(props){
    super(props);
    this.setState={email:""};
  }
  navSignup(){
   	this.props.navigator.push({
       component: SignupScene
      })
  }
  forgotPassword(){

    var possible="abcdefghijklmnopqrstuvwxyz0123456789";

    var newPassword="";
    for(var i=0;i<8;i++){
      newPassword+=possible.charAt(Math.floor((Math.random() * 36) + 1));
    }
    Fetch('getUserEmail','POST',{},null,function(reponse){
      console.log(response);
    })
  }
  render(){
    return(
      <View>
        <Background width={width} height={height}/>
        <View style={{alignItems:'center'}}>
          <Text style={{textAlign:'center',fontSize:width/18,fontWeight:'bold',color:'#e7e7e7',marginTop:height/12}}>
        Şifrenizi mi unuttunuz ?
          </Text>
          <Text style={{color:'#e7e7e7',fontSize:width/18, textAlign:'center',marginTop:height/10}}>
          E-mail adresinize yeni bir şifre gönderilicek.
          </Text>
          <Kohana
            style={styles.TextInput}
            label={'e-mail'}
            iconClass={Foundation}
            iconName={'mail'}
            iconColor={'#0097a7'}
            labelStyle={{ color: '#0097a7' }}
            inputStyle={{ color: '#0097a7' }}
            onChangeText={(email) => this.setState({email})}
          />
          <Button onPress={this.forgotPassword.bind(this)} style={styles.forgotButton}   textStyle={{color:'#e7e7e7',fontSize:width/18,fontWeight:'bold'}}>
            ONAYLA
          </Button>
          <Text  onPress={this.navSignup.bind(this)} style={{color:'#e7e7e7',fontSize:width/23,marginTop:height/24}}>
            Hala üye olmadınız mı? Hemen olun.
          </Text>
        </View>
      </View>
    );
  }
}
var styles=StyleSheet.create({
  background: {
    height: height,
    width: width,
    position: 'absolute',
  },
  forgotButton:{
    height:height/12,
    width:width*35/100,
    borderWidth:0.5,
    borderRadius:30,
      marginTop:height/23,
    borderColor:'#e7e7e7',
    backgroundColor:'#0097f7',
    margin:8,
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
    alignSelf:'center'
  },
  TextInput:{
    width:width*7/10,
    marginTop:height/14,
    height:height/12,
    borderRadius:20
  },
});
module.exports=ForgotPassword;
