import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Image,
  BackAndroid
} from 'react-native';
import Button from 'apsl-react-native-button'
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { Kohana } from 'react-native-textinput-effects';
import Foundation from 'react-native-vector-icons/Foundation';
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var SignupScene=require('./signupScene');
var Background = require('./Background');
var MainPageScene=require('./MainPageScene');
var LoginScene=require('./loginScene');
var ForgotPassword=require('./ForgotPassword');
var NetworkCon = require('./NetworkCon');


export default class WelcomeScene extends Component{

  constructor(props){
    super(props);
    this.state={isLoading:false};
  }
  navLogin(){
    if(this.props.mode == 'DEV'){
      this.props.navigator.push({
         component: MainPageScene
        })
      NetworkCon.loginSucceed();
    }else{
   	this.props.navigator.push({
       component: LoginScene
      })
    }
  }
  navSignup(){
   	this.props.navigator.push({
       component: SignupScene
      })
  }



  renderScene(){
    if(!this.state.isLoading){
      return(
        <View style={{flex:1,justifyContent:'center'}}>
          <Background height={height} width={width}/>
            <View style={{alignItems:'center'}}>

              <Image source={require('../images/guzeloldulan.png')} style={{height:width*27/40,width:width*9/10}}>
              <Text style={{color:'#e7e7e7',alignSelf:'flex-start',fontSize:width/10,fontWeight:'bold'}}>Helpout</Text>
              </Image>


              </View>
            <View  style={{marginTop:5,justifyContent:'space-around'}} >

                <Button style={[styles.buttons,{marginTop:height/20}]} onPress={this.navLogin.bind(this)} textStyle={styles.buttonTexts}>
                Giriş yap
                </Button>
                <Button style={styles.facebook}  textStyle={styles.buttonTexts}>
                facebook
                </Button>
                <Button style={[styles.buttons,{marginTop:height/200}]} onPress={this.navSignup.bind(this)}  textStyle={styles.buttonTexts}>Kayıt Ol</Button>

          </View>
        </View>
      );
    }else{
      return(
          <View style={{flex:1}}>
          <Background height={height} width={width}/>
          <ActivityIndicator
           animating={this.state.isLoading}
           color="#e7e7e7"
           size="large"
           style={{alignSelf:'center',paddingVertical:height*2/5}}
         />
         </View>
      );
    }
  }
  render(){
    return(
      <View style={{flex:1}}>
      <Background height={height} width={width}/>
        {this.renderScene()}
     </View>
   );
  }
}

var styles=StyleSheet.create({
input:{
  backgroundColor:'white',
  borderColor:'black',
  height:40
},
welcome:{
  fontSize:width/10,
  marginTop:height/12,
  color:'#e7e7e7',
  backgroundColor: 'transparent'
},
buttons:{
  height:height/12,
  width:width*4/5,
  borderWidth:0.5,
  borderRadius:30,
  borderColor:'#e7e7e7',
  backgroundColor:'#0097f7',
  elevation:6,
  shadowOffset:{width:1,height:3},
  shadowColor:'#616161',
  shadowRadius: 3,
  shadowOpacity:1,
  alignSelf:'center'
},
facebook:{
  height:height/12,
  width:width*4/5,
  borderWidth: 0.7,
  borderRadius:30,
  borderColor:'#e7e7e7',
 elevation:100,
 shadowOffset:{width:1,height:3},
 shadowColor:'#616161',
 shadowRadius: 3,
 shadowOpacity:1,
  backgroundColor:'blue',
  marginTop:height/200,
  alignSelf:'center'
},
buttonTexts:{
  color:'#e7e7e7',
  fontWeight:'bold'
},
TextInput:{
  width:width*4/5,
  marginTop:height/10,
  height:height/12,
  borderRadius:20,
  backgroundColor:'#e7e7e7'
},
TextInput2:{
  width:width*4/5,
  height:height/12,
  marginTop:height/45,
  borderRadius:20,
  backgroundColor:'#e7e7e7'
},
forgot:{
  marginTop:height/40,
  fontWeight:'bold',
  fontSize:width/20,
  color:'#e7e7e7',
  alignSelf:'center'
},
kayit:{
  marginBottom:height/40,
  fontWeight:'bold',
  fontSize:width/20,
    marginTop:height/30,
  color:'#e7e7e7',
  alignSelf:'center'
},
textStyle:{
  fontWeight:'bold',
  fontSize:width/19,
  color:'#e7e7e7',
  marginTop:height/30
}

});

module.exports=WelcomeScene;
