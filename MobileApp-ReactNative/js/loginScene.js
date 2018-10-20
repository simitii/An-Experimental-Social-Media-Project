import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView ,
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
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;
var Background = require('./Background');
var MainPageScene=require('./MainPageScene');
var ForgotPassword=require('./ForgotPassword');
export default class LoginScene extends Component{

  constructor(props){
    super(props);
    this.state={username:"",password:"",isLoading:false,isThereError:false,error:""};
  }
  login(){
      //START LOADING!
      this.setState({isLoading:true,isThereError:false,error:""});
      var username = this.state.username.toLowerCase();
      var password = this.state.password;
      var json = {
        "username": username,
        "password": password
      };
      let context = this;
      Fetch('login','POST',json,null,function(response){
        if(response == "1"){
          NetworkCon.loginSucceed();
          console.log("login succeed!");
          var data = {
            'username':username,
          }
          context.props.navigator.push({
             component: MainPageScene
          });
          context.props.updateUserData(data);
        }else{
          console.log("login failed!");
          var error = "Giris Basarisiz!\n";
          switch (response) {
            case 2:
              error+="Gecersiz e-mail adresi";
              break;
            case 3:
              error+="Gecersiz sifre";
              break;
            case 4:
              error+="Yanlis sifre";

          }
          console.log(error+response)
          context.setState({isLoading:false,error:error,isThereError:true});
        }
      });
  }
  navForgot(){
   	this.props.navigator.push({
       component: ForgotPassword
      })
  }
  navSignup(){
   	this.props.navigator.push({
       component: SignupScene
      })
  }



  renderScene(){
    if(!this.state.isLoading){
      return(


        <View >
          <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-40} >
          <Background height={height} width={width}/>
          <View style={{alignItems:'center'}}>
                <Text style={{color:'#e7e7e7',alignSelf:'center',fontSize:width/8,fontWeight:'bold',marginTop:height/7}}>HELPOUT</Text>
              <Kohana
                style={styles.TextInput}
                label={'Kullanıcı Adı'}
                iconClass={Foundation}
                iconName={'mail'}
                iconColor={'#0097a7'}
                labelStyle={{ color: '#0097a7',paddingLeft:width/50 }}
                inputStyle={{ color: '#0097a7' }}
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={(username) => this.setState({isThereError:false,username:username})}
              />
              <Kohana
                style={styles.TextInput2}
                label={'Şifre'}
                iconClass={MaterialsIcon}
                iconName={'lock'}
                iconColor={'#0097a7'}
                secureTextEntry={true}
                autoCapitalize='none'
                labelStyle={{ color: '#0097a7',paddingLeft:width/50}}
                inputStyle={{ color: '#0097a7' }}
                onChangeText={(password) => this.setState({isThereError:false,password:password})}
              />
              <Text style={styles.forgot}  onPress={this.navForgot.bind(this)}>Şifrenizi mi unuttunuz?</Text>
              </View>
            <View  style={{marginTop:5,justifyContent:'space-around'}} >
              <View >
                {this.state.isThereError ? (<Text style={{marginTop:height/70,textAlign:'center',color:'red',fontSize:width/21}}>{this.state.error}</Text>) : (<View></View>)}
              </View>

                <Button style={styles.buttons} onPress={this.login.bind(this)} textStyle={styles.buttonTexts}>
                Giriş yap
                </Button>

                <Text style={styles.kayit}  onPress={this.navSignup.bind(this)}>Henüz kayıt olmadınız mı?</Text>

          </View>
          </KeyboardAvoidingView >

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
    marginTop:height/30,
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
facebook:{
  height:height/12,
  width:width*4/5,
  borderWidth: 0.7,
  borderRadius:30,
  borderColor:'#3b5998',

  backgroundColor:'blue',
  margin:8,
  alignSelf:'center'
},
buttonTexts:{
  color:'#e7e7e7',
  fontWeight:'bold'
},
TextInput:{
  width:width*4/5,
  marginTop:height/6,
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

module.exports=LoginScene;
