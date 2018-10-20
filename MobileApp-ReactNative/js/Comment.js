import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;

var EventScene=require('./EventScene');
var Fetch = require('./NetworkCon').fetch;
var SocialMethods = require('./SocialMethods');

export default class Comment extends Component{
  constructor(props){
    super(props);
    this.state = {
     upButton:this.props.data?this.props.data.liked:false
   }
  }

  render(){
    var data = this.props.data || {};
    var uri = data.profilePicUri;
    var profilePic = !uri || uri==' ' ? <Icon name="user-o" size={height/15} style={{color:'#0097a7'}} /> : <Image style={styles.avatar} source={{uri}}/>;
    return(

        <TouchableOpacity>
          <View  style={styles.container} >
            <View style={{flexDirection:'row',margin:5,width:width*85/100,height:height/15,alignItems:'center'}}>
            {profilePic}
            <Text style={{margin:5,fontSize:height/45,color:'#0097a7'}}>
              {data.username || "Anonim"}
            </Text>
            <TouchableOpacity style={{position: "absolute",right: 0}}>
              <Icon name="ellipsis-v" size={width/13} style={{color:'#0097a7'}}/>
            </TouchableOpacity>
            </View>
            <View style={{flexDirection:'column',flex:1,margin:3}}>
              {data.text ? <Text style={styles.text}>{data.text}</Text> : <View/>}
              <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:height/90,paddingLeft:width/30,alignSelf:'center',width:width*90/100,height:height/20}}>
              <TouchableOpacity onPress={SocialMethods.up.call(this,'Comment',this.props.data?this.props.data._id:undefined)}>
                <View style={{flexDirection:'row',alignItems:'center',width:width*21/100}}>
                <Icon name="arrow-up" size={width/13} style={{color:this.state.upButton?'#1560BD':'#0097a7'}}/>
                <Text style={{margin:3,color:'#0097a7',fontWeight:'bold',fontSize:width/35}}>Yukari</Text>
                </View>
              </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={{flexDirection:'row',alignItems:'center',width:width*21/100}}>
                      <Icon name="share-alt" size={width/13} style={{color:'#0097a7'}} />
                      <Text style={{margin:3,color:'#0097a7',fontWeight:'bold',fontSize:width/35}}>Paylas</Text>
                    </View>
                  </TouchableOpacity>
              </View>
            </View>
            </View>
        </TouchableOpacity>


    );
  }
}
var styles=StyleSheet.create({
  container:{
    padding:4,
    margin:2,
    width:width*90/100,
    alignSelf:'center',
    backgroundColor:'#e7e7e3',
    borderColor:'#e7e7e7',
    borderRadius:10,
    marginTop:height/50,
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
  },
  avatar: {
    width: height/13,
    height: height/13,
    borderRadius: 5,
  },
  image:{
    height:height*30/100,
    alignSelf:'center',
    right:height/30,
    width:width*0.82,
    margin: 5,
    borderRadius:5,
    zIndex:0
  },
  imageButtons:{
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
    backgroundColor:'transparent'
  },
  text:{
    fontSize:width/25,
    color:'#212121',
    textAlign:'auto',
    margin:5
  },
  messageBox:{
    marginTop:height/90,
    width:width*75/100,
    height:height/20,
    marginLeft:height/100,
    backgroundColor:'white',
    padding:5,
    borderRadius:5,
    flexDirection:'row',
    alignItems:'center',
  }
})


module.exports = Comment;
