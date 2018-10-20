import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;

//var ProfileScene = require('./profileeScene');

var EventScene = require('./EventScene');
var NetworkCon = require('./NetworkCon');

import Icon from 'react-native-vector-icons/FontAwesome';

export default class ButtonThingForNews extends Component{
  constructor(props){
    super(props);
    this.state={
      invalidProfilePic:false,
      invalidProfilePicOfOtherUser:false,
    }
  }
  openCampaignPage(){
    this.props.navigator.push({
        component: EventScene,
        info: {_id:this.props.data?this.props.data.objectID:undefined,name:this.props.data?this.props.data.name:'no name',
        shortDescription:this.props.data?this.props.data.shortDescription:'',coverPicture:this.props.data?this.props.data.photo:undefined}
    });
  }
  openUserProfile(){
    /*this.props.navigator.push({
        component: ProfileScene,
        info:{profileUserName: this.props.data.user},
    });*/
  }
  renderChallange(data){
    return (
    <TouchableOpacity  onPress={this.openCampaignPage.bind(this)}>
      <View  style={styles.containerForChallangeButton} >
        <Text  style={{width:width*85/100,color:'#0097a7',fontSize:width/13,textAlign:'center',fontWeight:'bold'}}>
        {data.name?data.name:'Isimsiz'}
        </Text>

        <View style={{flexDirection:'column',flex:1,margin:3}}>
          {data.shortDescription?
          <Text style={styles.text}  >
            {data.shortDescription}
          </Text>
          :
        <View/>
        }
        {data.photo?
          <Image source={{uri:'http://localhost:8080' + data.photo}} style={styles.image}/>
          :
          <View/>
        }
        </View>
      </View>
    </TouchableOpacity>
  );
  }
  renderUser(data){
    var uri = NetworkCon.PROFILEPICS + data.user;
    var profilePic = !uri || this.state.invalidProfilePicOfOtherUser ? <Icon name="user-o" size={height/15} style={{color:'#0097a7'}} /> : <Image style={styles.avatar} onError={()=>this.setState({invalidProfilePicOfOtherUser:true})} source={{uri}}/>;
    return (
    <TouchableOpacity  onPress={this.openUserProfile.bind(this)}>
      <View  style={styles.containerForUserButton} >
        <View style={{'flexDirection':'row',alignItems:'center',alignSelf:'center'}}>
          {profilePic}
          <Text style={{margin:5,fontSize:height/45,color:'#0097a7'}}>
            {data.user || "Anonim"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  }
    render(){
      var data = this.props.data || {};
      data = {
        name:'xx',
        shortDescription:'yy',
        type:'likeCampaign',
        objectType:'campaign',
      }
      switch (data.type) {
        case 'likeCampaign':
            data.explanation = "asadaki challange icin Yukari dedi!";
            break;
        case 'followCampaign':
            data.explanation = "asadaki challange icin Takip dedi!";
            break;
        case 'commentCampaign':
            data.explanation = "asadaki challange icin Yorum Yapti!";
            break;
        case 'followUser':
            data.explanation = "asadaki kullanici icin Takip dedi!";
            break;
        default: data.explanation = "";
      }
      var uri = NetworkCon.PROFILEPICS + data.username;
      var profilePic = !uri || this.state.invalidProfilePic ? <Icon name="user-o" size={height/15} style={{color:'#0097a7'}} /> : <Image style={styles.avatar} onError={()=>this.setState({invalidProfilePic:true})} source={{uri}}/>;
      return(

        <TouchableOpacity >
          <View  style={styles.container} >
            <View style={{flexDirection:'row',margin:5,width:width*91/100,height:height/15,alignItems:'center'}}>
            {profilePic}
            <Text style={{margin:5,fontSize:height/45,color:'#0097a7'}}>
              {data.username || "Anonim"}
            </Text>
            <Text style={{margin:1,fontSize:height/52,color:'#616161',width:width*0.60}}>
              {data.explanation}
            </Text>
            <TouchableOpacity style={{position: "absolute",right: 0}}>
              <Icon name="ellipsis-v" size={width/13} style={{color:'#0097a7'}}/>
            </TouchableOpacity>
            </View>
            {data.objectType=="campaign"?
            this.renderChallange.call(this,data)
            :
            <View/>}
            {data.objectType=="user"?
            this.renderUser.call(this,data)
            :
            <View/>}
          </View>
        </TouchableOpacity>
      );
    }
  }

const styles=StyleSheet.create({
  container:{
    padding:4,
    width:width*97/100,
    alignSelf:'center',
    backgroundColor:'#e7e7e7',
    borderColor:'#e7e7e7',
    borderRadius:10,
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
    marginBottom:height*0.02,
  },
  containerForChallangeButton:{
    padding:width*0.02,
    margin:2,
    width:width*94/100,
    alignSelf:'center',
    backgroundColor:'#e7e7e3',
    borderColor:'#e7e7e7',
    borderRadius:10,
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
  },
  containerForUserButton:{
    padding:width*0.02,
    margin:2,
    width:width*0.94,
    alignSelf:'center',
    backgroundColor:'#e7e7e3',
    borderColor:'#e7e7e7',
    borderRadius:10,
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
  },
  image:{
    height:height*33/100,
    alignSelf:'center',
    width:width*9/10,
    margin: 5,
    borderRadius:10,
    zIndex:0
  },
  avatar: {
    width: height/13,
    height: height/13,
    borderRadius: 5,
  },
  text:{
    alignSelf:'center',
    width:width*0.89,
    fontSize:width/25,
    color:'#212121',
    textAlign:'auto',
    margin:5
  },
});

module.exports=ButtonThingForNews;
