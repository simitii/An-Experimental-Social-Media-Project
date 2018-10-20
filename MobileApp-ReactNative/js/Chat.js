import React, { Component } from 'react';
import {
  ActivityIndicator,
  Modal,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var Background = require('./Background');
var NavBar = require('./NavBar');
var NetworkCon = require('./NetworkCon');

import { GiftedChat } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Chat extends Component{
  constructor(props){
    super(props);
    this.state={messages: [],refresh: false};
    this.onSend = this.onSend.bind(this);
  }
  goBack(){
    this.props.navigator.pop();
  }
  setMessages(){
    let chat = NetworkCon.getChat(this.props.info.chatWith._id);
    let messages = [];
    if(chat != null){
      let id = 0;
      for(message in chat.messages){
        messages = [chat.messages[message]].concat(messages);
      }
      NetworkCon.makeZeroNewMessage(chat);
    }
    this.setState({
      messages: messages,
    });
  }
  componentWillMount() {
    this.setMessages();
  }
  onSend(messages = []) {
    this.setState((previousState) => {
      for(i in messages){
        messages[i].toWhom = this.props.info.chatWith;
      }
      NetworkCon.sendMessage(messages);
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
  renderImage(imageURL){
    if(imageURL !== undefined && imageURL !== null && imageURL !== ""){
      return (<View style={{right:height*0.04,borderRadius:10}}>
          <Image source={require('../images/112081.jpg')} style={{borderRadius:10,height:height*0.06,width:height*0.06,}}/>
        </View>);
    }
      return <View style={{right:height*0.04,borderRadius:10,
                  backgroundColor:'#0097a7',
                  height:height*0.06,
                  width:height*0.06,
                  alignItems:'center',
                  justifyContent:'center'}}>
         <Icon name="user-o" size={height*0.04} style={{color:'#e7e7e7'}} />
       </View>;
  }
  render(){
    let context = this;
    NetworkCon.newMessageListener(function(){
      context.setMessages();
    });
    return(
        <View style={{flex:1}}>
        <Background width={width} height={height}/>
        <NavBar onPressIcon={()=> this.goBack()}  justifyContent={true} height={height/11} width ={width} color= "#e7e7e7" iconName="arrow-left" search ={false} settings={true}/>
        <TouchableOpacity style={{position:'absolute',top:20,left:width*0.17,height:height*0.07,width:width*0.69,alignItems:'center',justifyContent:'center',backgroundColor:'#e7e7e7',
            padding:4,
            borderRadius:10,
            elevation:6,
            shadowOffset:{width:1,height:3},
            shadowColor:'#616161',
            shadowRadius: 3,
            shadowOpacity:1,
            flexDirection:'row'}}>
            {this.renderImage(1)}
          <Text style={{right:height*0.025,color:'#0097a7',fontWeight:'bold',fontSize:height*0.03}}>{this.props.info.chatWith._id}</Text>
        </TouchableOpacity>
        <View style={{top:height/16,height:height*10/11}}>
        <GiftedChat
          renderLoading={function(){
            return (  <ActivityIndicator
                       animating={true}
                       color="#e7e7e7"
                       size="large"
                       style={{alignSelf:'center',paddingVertical:height*2/5}}
                     />)
          }}
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: 'samet',
          }}
        />
        </View>
        </View>
    );
  }
}
module.exports=Chat;
