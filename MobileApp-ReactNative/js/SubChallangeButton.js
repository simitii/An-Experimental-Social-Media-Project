
import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';

let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SubChallangeButton extends Component {
  render(){
    var boxSize = width/6*1.15;
    var boxMargin = 4;
    var boxPadding = 2;
    if(this.props.subChallangeButtonStyle == "square"){
      return (
        <TouchableOpacity onPress={this.props.onPress} style={{
            backgroundColor:"#558B2F",
            height:boxSize,width:boxSize,
            borderRadius:20,margin:boxMargin*2.5,
            padding:boxPadding,
            justifyContent:'center',
            elevation:6,
            shadowOffset:{width:1,height:3},
            shadowColor:'#616161',
            shadowRadius: 3,
            shadowOpacity:1,}}>
            <View style={{flexDirection:'row'}}>
            <Text style={{height:width/16,width:width/10,fontSize:width/20,alignSelf:'center',textAlign:'center',color:'#e7e7e7',backgroundColor:'#689F38',fontWeight:'bold'}}>{this.props.subChallangeNumber || "*"}</Text>
            {this.props.succeed ?<Icon name="check" size={width/12} color="#e7e7e7" style={{backgroundColor:'transparent'}}/> : <Icon name="hourglass-half" size={width/13} color="#e7e7e7" style={{backgroundColor:'transparent',left:5}}/>}
            </View>
        </TouchableOpacity>
      );
    }else{
      var text = (this.props.subChallangeNumber || "#") + " : " + (this.props.subChallangeName || "SubChallange");
      return (
        <TouchableOpacity onPress={this.props.onPress}
            style={{
            backgroundColor:"#558B2F",
            height:boxSize,width:width*0.95,
            borderRadius:20,margin:boxMargin,
            padding:boxPadding,
            justifyContent:'center',
            elevation:6,
            shadowOffset:{width:1,height:3},
            shadowColor:'#616161',
            shadowRadius: 3,
            shadowOpacity:1,}}>
            <View style={{flexDirection:'row'}}>
            <Text style={{height:width/15,width:width*0.85,fontSize:width/20,alignSelf:'center',textAlign:'center',color:'#e7e7e7',backgroundColor:'#689F38',fontWeight:'bold'}}>{text || "*"}</Text>
            {this.props.succeed ?<Icon name="check" size={width/12} color="#e7e7e7" style={{backgroundColor:'transparent'}}/> : <Icon name="hourglass-half" size={width/13} color="#e7e7e7" style={{backgroundColor:'transparent',left:5}}/>}
            </View>
        </TouchableOpacity>
      );
    }
  }

}

module.exports = SubChallangeButton;
