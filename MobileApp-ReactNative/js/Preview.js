
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';

let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var Background = require('./Background');
var NavBar = require('./NavBar');

export default class Preview extends Component {
  constructor(props){
    super(props);
  }
  getTokenName(token){
    if(token === "<b>"){
      return 'bold';
    }else if (token === "<i>") {
      return 'italic';
    }
    return '';
  }
  renderInfo(){
    var info = this.props.info;
    var rows = [];
    var key = 0;
    for(var i = 0;i<info.length;i++){
      var element = info[i];
      if(element.type === 'img'){
          rows.push(<Image key={key++} style={} source={element.source} />);
        }else{
          var content = element.content;
          var contentLen = content.length;
          var italic = false;
          var bold = false;
          var text = "";
          var row = [];
          for(var ii=0;ii<contentLen;){
            if(content.substring(ii,ii+1) === "<" && getTokenName(content.substring(ii,ii+3))==='bold'){
              if(text.length>0){
                if(italic){
                  row.push(<Text key={key++} style={{fontSize:15,fontStyle:'italic'}}>{text}</Text>);
                }else {
                  row.push(<Text key={key++} style={{fontSize:15}}>{text}</Text>);
                }
              }
              bold = true;
              ii += 3;
              text = "";
            }else if(content.substring(ii,ii+1) === "<" && getTokenName(content.substring(ii,ii+3))==='italic'){
              if(text.length>0){
                if(bold){
                  row.push(<Text key={key++} style={{fontSize:15,fontWeight:'bold'}}>{text}</Text>);
                }else {
                  row.push(<Text key={key++} style={{fontSize:15}}>{text}</Text>);
                }
              }
              italic = true;
              ii += 3;
              text = "";
            }else if (content.substring(ii,ii+1) === "<" && getTokenName(content.substring(ii,ii+3))==='boldClose') {
              if(text.length>0){
                if(italic){
                  row.push(<Text key={key++} style={{fontSize:15,fontStyle:'italic',fontWeight:'bold'}}>{text}</Text>);
                }else {
                  row.push(<Text key={key++} style={{fontSize:15,fontWeight:'bold'}}>{text}</Text>);
                }
              }
              bold = false;
              ii += 4;
              text = "";
            }else if (content.substring(ii,ii+1) === "<" && getTokenName(content.substring(ii,ii+3))==='italicClose') {
              if(text.length>0){
                if(bold){
                  row.push(<Text key={key++} style={{fontSize:15,fontWeight:'bold',fontStyle:'italic'}}>{text}</Text>);
                }else {
                  row.push(<Text key={key++} style={{fontSize:15,fontStyle:'italic'}}>{text}</Text>);
                }
              }
              italic = false;
              ii += 4;
              text = "";
            }else{
              text += content.substring(ii,ii+1);
              ii++;
            }
          }
        }
      }
      return rows;
  }
  render() {
    return (

    );
  }
}

module.exports = App;
