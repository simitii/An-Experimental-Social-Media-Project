import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var EventScene=require('./EventScene');

export default class ButtonThing2 extends Component{
  constructor(props){
    super(props);
    this.state=({
      asf:""
    });
  }
  openCampaignPage(){
    this.props.navigator.push({
        component: EventScene,
        info: {_id:this.props.data?this.props.data._id:undefined,name:this.props.data?this.props.data.name:'no name',
        shortDescription:this.props.data?this.props.data.shortDescription:'no name',coverPicture:this.props.data?this.props.data.coverPicture:undefined}
    });
  }
    render(){
      var data = this.props.data || {};

      return(

        <TouchableOpacity style={styles.container} onPress={this.openCampaignPage.bind(this)}>
          <View style={{flexDirection:'row',justifyContent:'space-around'}}>
            <View>
              <Text style={styles.dayText}>
              {data.days}
              </Text>
              <Text style={styles.dateText}>
              {data.startDate}

              </Text>
              <Text style={styles.dateText}>

               {data.finishDate}
              </Text>
            </View>
            <Text  style={styles.challengeName}>
            {data.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

const styles=StyleSheet.create({
container:{
  width:width*95/100,
  marginTop:height/80,

  borderRadius:20,
  backgroundColor:'#e7e7e7'
},
dayText:{
  width:width/5,
  marginLeft:width/19,
  color:'#0097a7',
  fontSize:width/20,
  fontWeight:'bold',
  marginTop:height/80
},
dateText:{
  width:width*24/100,
  marginLeft:width/40,
  color:'#0097a7',
  fontSize:width/25,
  fontWeight:'bold',
  marginTop:height/100
},
challengeName:{
  width:width*7/10,
  marginTop:height/200,

  color:'#0097a7',
  fontSize:width/15,
  fontWeight:'bold'
}
});

module.exports=ButtonThing2;
