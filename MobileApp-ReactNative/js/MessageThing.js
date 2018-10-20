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
var Chat = require('./Chat');

export default class MessageThing extends Component{
  constructor(props){
    super(props);
    this.state={};
  }
  navSettings(){
    this.props.navigator.push({
       component: SettingsScene
      })
  }
  goBack(){
    this.props.navigator.pop();
  }
  goToChat(){
    this.props.navigator.push({
       component: Chat,
       info: {
         chatWith:{
                _id:this.props.username,
                name: this.props.name,
                avatar: this.props.avatar,
              }
            },
     });
  }
  render(){
    return(
              <TouchableHighlight
                onPress={this.goToChat.bind(this)}
                style={{height:height/8,
                width:width*49/50,
                marginLeft:width/100,
                marginRight:width/100,
                borderRadius:20,
                backgroundColor:'#e7e7e7',
                marginTop:5,
                elevation:6,
                shadowOffset:{width:1,height:3},
                shadowColor:'#616161',
                shadowRadius: 3,
                shadowOpacity:1,}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                  <Image style={{borderRadius:33,width:width/6,height:width/6,marginLeft:width/50,marginTop:height/100}} source={require('../images/leyla2.jpg')}/>
                  <View style={{width:width*70/100}}>
                    <View style={{height:height/25,marginTop:height/32}}>
                      <Text style={{alignSelf:'center',color:'#0097a7',fontSize:width/17,marginRight:width/50}}>{this.props.name}</Text>
                    </View>
                    <View style={{height:height/30,marginTop:height/100}}>
                      <Text style={{alignSelf:'center',color:'#BDBDBD'}}>Son Mesaj: dün</Text>
                    </View>
                  </View>
                  <View style={{
                    top:5,
                    marginRight:width/20,
                    height : width/20,
                    width: width/14,
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor:'#0097c7',
                    borderRadius:5,
                  }}>
                  <Text style={{
                    fontSize: width/35,
                    textAlign:'center',
                    color:'#e7e7e7'
                  }} >{this.props.numberOfNewMessage}</Text>
                  </View>
                </View>
              </TouchableHighlight>
    );
  }
}
module.exports=MessageThing;
