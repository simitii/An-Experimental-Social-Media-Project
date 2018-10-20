import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
var SettingsScene=require('./SettingsScene');
var Chat = require('./Chat');
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var ButtonThing=require('./ButtonThing');
var ButtonThingForNews=require('./ButtonThingForNews');
var NavBar=require('./NavBar');
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;
var Background = require('./Background');
var ErrorJS = require('./Error');
import Icon from 'react-native-vector-icons/FontAwesome'

export default class ProfileeScene extends Component{

  constructor(props){
    super(props);
    this.isMyProfile = this.props.username==this.props.info.profileUserName;
    this.state = {
     visible: false,
     reputation:"",
     profileName:"",
     followers:0,
     challengePoint:0,
     error:false,
     isLoading:false,
     profilePic:this.isMyProfile?this.props.profilePic:null,
     invalidProfilePic:false,
   }

  }
  navSettings(){
    this.props.navigator.push({
       component: SettingsScene
      })
  }
  navChat(){
    this.props.navigator.push({
      component: Chat,
      info: {chatWith:{_id:this.props.info.profileUserName,}},
    });
  }
  goBack(){
    this.props.navigator.pop();
  }
  renderImage(imageURL){
    if(imageURL && !this.state.invalidProfilePic){
      return <View style={{   borderRadius:20,
         borderWidth:0.7,
         borderColor:'#007bc7',
         height:height*1/6,
         width:height*1/6,
         alignItems:'center',
         elevation:6,
         shadowOffset:{width:1,height:3},
         shadowColor:'#616161',
         shadowRadius: 3,
         padding:4,
         shadowOpacity:1,
         justifyContent:'center'}}>
      <Image source={{uri:imageURL}} onError={()=>this.setState({invalidProfilePic:true})} style={styles.image}/>
      </View>;
    }
      return <View style={{   borderRadius:20,
         borderWidth:0.7,
         borderColor:'#007bc7',
         height:height*1/6,
         width:height*1/6,
         alignItems:'center',
         elevation:6,
         shadowOffset:{width:1,height:3},
         shadowColor:'#616161',
         shadowRadius: 3,
         padding:4,
         shadowOpacity:1,
         justifyContent:'center'}}>
       <Icon name="user-o" size={height/7} style={{color:'#e7e7e7'}} />
       </View>;
  }
  getProfile(){

    var context=this;


    var json={};
    json.username=context.state.username;
    Fetch('getUser','POST',json,null,function(response){
      console.log("LLLLLLLLLLLLLLLLLLLLLLLL");

        console.log("response"+response.username+response.followers.length+response.challengePoint);

      context.setState({
        profileName:response.username,
        followers:response.followers.length,
        reputation:response.reputation,
        challengePoint:response.challengePoint
      })

    })
  }
  componentWillMount(){
    //console.log("sdfsfd");
    //this.getProfile();
    //console.log("ALLAHUAKBAR");
  }
  render(){

    return(
      <View style={{flex:1}}>
        <Background height={height} width={width}/>
          <NavBar onPressIcon={()=> this.goBack()} navSettings={this.navSettings.bind(this)}  justifyContent={true} height={height/11} width ={width} color= "#e7e7e7"  text = {"Profil"} iconName="arrow-left" search ={false} settings={!this.state.error && !this.state.isLoading && this.isMyProfile}/>
          {this.state.error?
            <ErrorJS errorTitle={"Baglanti Problemi!"}
                      errorText={"Internet Baglantisi Calismiyor\nLutfen baglantinizi kontrol edin"}
                        callback={()=>{
                            //TODO implement callback
                          }}/>
              :
              <View/>
          }
          {this.state.isLoading?
            <ActivityIndicator
                       animating={true}
                       color="#e7e7e7"
                       size="large"
                       style={{alignSelf:'center',paddingVertical:height*0.44}}
                     />
            :
          <View/>
          }
            <View style={{top:height*0.08,height:height*26/100,backgroundColor:'#0097a7',flexDirection:'row',justifyContent:'space-around'}}>
            <View style={{position:'absolute',left:0,marginLeft:width/26}}>
              {this.renderImage(this.state.profilePic)}
            </View>
            <View style={{position:'absolute',top:height*0.01,left:width*0.36,width:width*0.60,height:height/7,alignItems:'center',justifyContent:'center'}}>
            <Text style={{textAlign:'center',color:'#e7e7e7',fontWeight:'bold',fontSize:height*0.04}}>{this.props.info.profileUserName}</Text>
            <Text style={{textAlign:'center',color:'#e7e7e7',fontWeight:'bold',fontSize:height*0.04}}>{this.state.name}</Text>
                {!this.isMyProfile?
                <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                <TouchableOpacity onPress={this.navChat.bind(this)} style={{padding:4,alignSelf:'center',width:width*0.33,borderWidth:0,borderRadius:10,height:height*0.05,backgroundColor:'#e7e7e7',justifyContent:'center',elevation:6,
                    shadowOffset:{width:1,height:3},
                    shadowColor:'#616161',
                    shadowRadius: 3,
                    shadowOpacity:1,
                    margin:height*0.01}}>
                  <Text style={{textAlign:'center',color:'#0097a7',fontWeight:'bold'}}>Ozel Mesaj</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{/**/}} style={{padding:4,alignSelf:'center',width:width*0.22,borderWidth:0,borderRadius:10,height:height*0.05,backgroundColor:'#e7e7e7',justifyContent:'center',elevation:6,
                    shadowOffset:{width:1,height:3},
                    shadowColor:'#616161',
                    shadowRadius: 3,
                    shadowOpacity:1,
                    margin:height*0.01}}>
                  <Text style={{textAlign:'center',color:'#0097a7',fontWeight:'bold'}}>Takip</Text>
                </TouchableOpacity>
                </View>
                :
                <View/>
                }
            </View>
          </View>

            <ScrollableTabView onChangeTab={(result)=>{/*pageNumber = result.i*/}} renderTabBar={() => <ScrollableTabBar underlineStyle={{backgroundColor:'#e7e7e7'}} />} tabBarTextStyle={{color:'#e7e7e7'}} >
            <ScrollView tabLabel='Son Aktiviteler' style={{marginTop:0}}>
            <View style={{alignItems:'center',marginTop:height/50}}>
              <ButtonThingForNews navigator={this.props.navigator}/>
              <ButtonThingForNews navigator={this.props.navigator}/>
              <ButtonThingForNews navigator={this.props.navigator}/>
            </View>
            </ScrollView>
            <ScrollView tabLabel='Katildiklari' style={{marginTop:0}}>
            <View style={{alignItems:'center',marginTop:height/50}}>
              <ButtonThing/>
              <ButtonThing/>
              <ButtonThing/>
            </View>
            </ScrollView>
          </ScrollableTabView>
          </View>
  );
  }
}
var styles=StyleSheet.create({

  image:{
   height:height*1/6,
   width:height*1/6,
   borderRadius: 10,
 },
 scrollViewStyle:{
   marginBottom:height/50,
 },
 nameText:{
   color:'#e7e7e7',
   fontSize:height/24,
   fontWeight:'bold',

   backgroundColor:'transparent',
   textAlign:'center'
 },
 buttonText:{
   color:'#e7e7e7',
   fontWeight:'bold',
   fontSize:height/50
 },
 reputationText:{
   color:'#e7e7e7',
   fontSize:height/39,
   fontWeight:'bold',
   height:height/17,
   width:width*2/3,
   backgroundColor:'transparent',
   textAlign:'center'
 },
 özelmesaj:{
   margin:4,
   marginBottom:20,
   width:width*15/52,
   height:height/18,
   borderWidth: 0.7,
   borderRadius:15,
   backgroundColor:'#0097a7',
   borderColor:'#007bc7'
 },
 davetGönder:{
   margin:4,
   marginBottom:20,
   width:width*15/52,
   borderRadius:15,
   height:height/18,
   borderWidth: 0.7,
   borderColor:'#007bc7',
   backgroundColor:'#0097a7'
},
 name:{
  alignItems:'center'
},
altBar:{
  height:height/16,
  width:width,
  left:0,
  top:height*16/59,
  position:'absolute',
  backgroundColor:'#0097a7'
},
buttons:{
  width:width*15/52,
  height:height/18,
  borderWidth:0.5,
  borderRadius:30,
  marginTop:height/50,
  borderColor:'#e7e7e7',
  backgroundColor:'#0097f7',
  margin:8,
  elevation:6,
  shadowOffset:{width:1,height:3},
  shadowColor:'#616161',
  shadowRadius: 3,
  shadowOpacity:1,
  alignSelf:'center'
},
buttons2:{
  width:width*32/52,
  height:height/18,
  borderWidth:0.5,
  borderRadius:30,
  marginTop:height/200,
  borderColor:'#e7e7e7',
  backgroundColor:'#0097f7',
  margin:8,
  elevation:6,
  shadowOffset:{width:1,height:3},
  shadowColor:'#616161',
  shadowRadius: 3,
  shadowOpacity:1,
  alignSelf:'center'
},
button:{
  backgroundColor:'#0097a7',
  width:width*99/300,
  height:height/18,
  borderColor:'#0097a7'
},
textStyle:{
  color:'#e7e7e7',
  fontWeight:'bold',
  fontSize:height/45
},

attended3:{
  backgroundColor:'#e7e7e7',
  height:(height/5),
  width:width*48/50,
  borderColor:'#007bc7'
}

});
module.exports=ProfileeScene;
