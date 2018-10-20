/**
 * ProjectDelta App
 * https://bitbucket.org/exteremecoders/project-delta-app/
 * @simitii
 * @kaandura
 *
 * Main App
 */
 'use strict';

import React, { Component } from 'react';
import {
  Navigator,
  Dimensions,
  BackAndroid,
  AsyncStorage,
  View,
  ActivityIndicator
} from 'react-native';

let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
let LoginScene=require('./loginScene');
let Background=require('./Background');
var MainPageScene=require('./MainPageScene');
var CommentCreate=require('./CommentCreate');
var EventScene=require('./EventScene');
var ProfileScene=require('./profileeScene');
var ForgotPassword=require('./ForgotPassword');
var SignupScene=require('./signupScene');
var Error=require('./Error');
var Messages=require('./Messages');
var ButtonThingForNews=require('./ButtonThingForNews');
var ShareThing = require('./ShareThing');
var SubChallange = require('./SubChallange');
var ImprovementScene = require('./ImprovementScene');
var Comment = require('./Comment');

var NetworkCon = require('./NetworkCon');


var WelcomeScene=require('./WelcomeScene');
export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      username:'',
      nameOfUser:'',
      profilePic:'',
      isLoading:true,
      invalidProfilePic:false,
    }
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
        if (navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true;
        }
        return false;
    });
    this.setUserDataStates();
  }

  updateUserData(newData){
    var data = [['username',newData.username?newData.username:''],['nameOfUser',newData.nameOfUser?newData.nameOfUser:''],['profilePic',newData.profilePic?newData.profilePic:'']];
    AsyncStorage.multiSet(data,function(err){
      console.log("AsyncStorage Error " + err);
    });
    this.setState({'username':newData.username,'nameOfUser':newData.nameOfUser,'profilePic':newData.profilePic});
  }
  setUserDataStates(){
    var data = ['username','nameOfUser','profilePic'];
    var context = this;
    AsyncStorage.multiGet(data,function(err,result){
      if(!err){
          context.setState({'username':result[0][1]?result[0][1]:'',
                'nameOfUser':result[1][1]?result[1][1]:'',
                'profilePic':result[2][1]?result[2][1]:'',
                isLoading:false,
              });
      }else{
        //handle error
      }
    });
  }
  profilePicErrorHandler(){
    this.setState({invalidProfilePic:true});
  }
  renderScene (route, navigator) {

          return <route.component username={this.state.username} profilePic={"http://localhost:8080/api/uploads/"+this.state.username}
          invalidProfilePic={this.state.invalidProfilePic} profilePicErrorHandler={this.profilePicErrorHandler.bind(this)}
          updateUserData={this.updateUserData} navigator={navigator} width={width} height={height} info={route.info}/>;


  }
  render() {
    console.log(this.state);
    if(this.state.isLoading){
      return (
        <View style={{flex:1}}>
        <Background height={height} width={width}/>
        <ActivityIndicator
         animating={true}
         color="#e7e7e7"
         size="large"
         style={{alignSelf:'center',paddingVertical:height*0.45}}
       />
       </View>
      );
    }else{
      var initialRoute = WelcomeScene;
      if(this.state.username!=null && this.state.username!=''){
        NetworkCon.loginSucceed();
        initialRoute = MainPageScene;
      }

      return (
        <Navigator  ref={(nav) => { navigator = nav; }}
          renderScene={this.renderScene.bind(this)}
          initialRoute={{component: initialRoute}}
          configureScene={(route, routeStack) =>
      Navigator.SceneConfigs.FadeAndroid}
          />
      );
    }
  }
}

module.exports = App;
