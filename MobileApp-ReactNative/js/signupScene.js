import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import Button from 'apsl-react-native-button'
import Foundation from 'react-native-vector-icons/Foundation'
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons'
import { Kohana } from 'react-native-textinput-effects'
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var Background = require('./Background');
var MainPageScene=require('./MainPageScene');
 class SignupScene extends Component{
   constructor(props){
     super(props);
     this.state={username:"",password:"",email:""};
   }
   register(){
       //START register!
       //gets the register props
       this.setState({isLoading:true,isThereError:false,error:""});
       var username = this.state.username.toLowerCase();
       var password = this.state.password;
          var email = this.state.email;
       var json = {
         "username": username,
         "password": password,
         "email":email
       };
       let context = this;
       Fetch('register','POST',json,null,function(response){
         if(response == "1"){
           //if they are valid, proceeds to login
          // NetworkCon.loginSucceed();
           console.log("login succeed!");
           Fetch('login','POST',json,null,function(response){
             console.log(response);
             if(response == "1"){
               //NetworkCon.loginSucceed();
               console.log("ALLAH");
               context.props.navigator.push({
                  component: MainPageScene
               });
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
         }else{
           console.log("login failed!");
           var error = "Giris Basarisiz!\n";
           console.log(response);
           switch (response) {
             case 2:
               error+="Gecersiz e-mail adresi";
               break;
             case 3:
               error+="Gecersiz sifre";
               break;
           }
           context.setState({isLoading:false,error:error,isThereError:true});
         }
       });
   }
  render(){
    return(

     <KeyboardAvoidingView behavior={'position'} style={{height:height,width:width}} keyboardVerticalOffset={-100}>
     <View style={{paddingTop:height/10}}>

       <Background width={width} height={height}/>
       <View style={{alignItems:'center'}}>
          <Text style={styles.welcome}>
          HELPOUT
          </Text>
          <Kohana
            style={styles.TextInput}
            label={'e-mail'}
            iconClass={Foundation}
            iconName={'mail'}
            iconColor={'#0097a7'}
            labelStyle={{ color: '#0097a7',paddingLeft:width/50 }}
            inputStyle={{ color: '#0097a7' }}
            value={this.state.email}
            onChangeText={(email) => this.setState({email})}
          />
          <Kohana
            style={styles.TextInput2}
            label={'isim'}
            iconClass={Foundation}
            iconName={'mail'}
            iconColor={'#0097a7'}
              value={this.state.username}
            labelStyle={{ color: '#0097a7',paddingLeft:width/50 }}
            inputStyle={{ color: '#0097a7' }}
            onChangeText={(username) => this.setState({username})}
          />
          <Kohana
            style={styles.TextInput2}
            label={'password'}
            iconClass={MaterialsIcon}
            iconName={'lock'}
            iconColor={'#0097a7'}
            labelStyle={{ color: '#0097a7',paddingLeft:width/50}}
            inputStyle={{ color: '#0097a7' }}
              value={this.state.password}
            onChangeText={(password) => this.setState({password})}
          />
          <Button style={styles.buttons}  onPress={this.register.bind(this)} textStyle={{color:'#e7e7e7',fontSize:width/18,fontWeight:'bold'}}>
            KAYIT OL
          </Button>
        </View>
        </View>

        </KeyboardAvoidingView >


    );
  }
}
const styles=StyleSheet.create({
  TextInput:{
    width:width*4/5,
    marginTop:height/10,
    height:height/12,
    borderRadius:20
  },
  welcome:{
    fontSize:width/10,
    marginTop:height/12,
    color:'#e7e7e7',
    backgroundColor: 'transparent'
  },
  TextInput2:{
    width:width*4/5,
    height:height/12,
    marginTop:height/45,
    borderRadius:20
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
    alignSelf:'center'
  },
  signupButton:{
    backgroundColor:'#e7e7e7',
    marginTop:height/120,
    width:width/3,
    height:height/13,
    borderColor:'#0097a7',
    marginTop:height/30,
    alignSelf:'center'
  },
});
module.exports=SignupScene;
