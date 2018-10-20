import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var Background = require('./Background');
var SettingsScene=require('./SettingsScene');
var NavBar = require('./NavBar');
var MessageThing=require('./MessageThing');
var ButtonThing=require('./ButtonThing');
var NetworkCon = require('./NetworkCon');

export default class Messages extends Component{
  constructor(props){
    super(props);
    this.state={refresh: false};
  }
  navSettings(){
    this.props.navigator.push({
       component: SettingsScene
     });
  }
  goBack(){
    this.props.navigator.pop();
  }
  renderMessageThings(){
    var row = [];
    let chats = NetworkCon.getChatsWithoutDetail();
    console.log(chats);
    let key = 0;
    for(i in chats){
      let chat = chats[i];
      let _id = chat.withUser._id;
      let name = chat.withUser.name;
      let avatar = chat.withUser.avatar;
      let numberOfNewMessage = chat.numberOfNewMessage;
      row.push(<MessageThing key={key++} username={_id} name={name} avatar={avatar} navigator ={this.props.navigator} numberOfNewMessage={numberOfNewMessage}/>);
    }
    return row;
  }
  render(){
    let context = this;
    NetworkCon.newMessageListener(function(){
      context.setState({refresh:true});
    });
    return(
        <View style={{flex:1}}>
          <Background width={width} height={height}/>
          <NavBar onPressIcon={()=> this.goBack()} navSettings={this.navSettings.bind(this)}  justifyContent={true} height={height/11} width ={width} color= "#e7e7e7"  text = "Mesajlar" iconName="arrow-left" search ={false} settings={true}/>
          <ScrollView style={{marginTop:height/11+5}}>
              {this.renderMessageThings()}
          </ScrollView>
        </View>
    );
  }
}
module.exports=Messages;
