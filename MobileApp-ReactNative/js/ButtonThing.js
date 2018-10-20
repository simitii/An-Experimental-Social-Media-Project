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
import Icon from 'react-native-vector-icons/FontAwesome';

let window = Dimensions.get('window');
let width = window.width;
let height = window.height;

var EventScene=require('./EventScene');
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;
var SocialMethods = require('./SocialMethods');

import ModalBox from 'react-native-simple-modal';

export default class ButtonThing extends Component{
  constructor(props){
    super(props);
    if(this.props.data){
      this.state = {
       notificationButton:this.props.data.followed,upButton:this.props.data.liked,
       numberOfFollowers:this.props.data.numberOfFollowers,numberOfPeopleLiked:this.props.data.numberOfPeopleLiked,
       numberOfComments:this.props.data.numberOfComments,modalVisible:false,
      }
  }else{
      this.state = {
       notificationButton:false,upButton:false,
       numberOfFollowers:0,numberOfPeopleLiked:0,
       numberOfComments:0,modalVisible:false,
      }
  }
  }
  handleDataUpdate(context){
    return function(newData){
      console.log("HERE I AM");
      context.setState({notificationButton:newData.followed,upButton:newData.liked,numberOfFollowers:newData.numberOfFollowers,numberOfPeopleLiked:newData.numberOfPeopleLiked});
      context.props.handleDataUpdate(newData);
    }
  }
  openCampaignPage(context,initialPage){
    var data = context.props.data;
    data.numberOfFollowers = context.state.numberOfFollowers;
    data.numberOfPeopleLiked = context.state.numberOfPeopleLiked;
    data.followed = context.state.notificationButton;
    data.liked = context.state.upButton;
    context.props.navigator.push({
        component: EventScene,
        info: {data:context.props.data,handleDataUpdate:context.handleDataUpdate(context),
               initialPage:initialPage},
    });
  }

  render(){
    var data = this.props.data || {};
    let shareOptions = {
    title: data.name + " Challange",
    message: data.name + " Challange seni bekliyor. ChallangeApp kullanarak katil!\nChallangeApp simdi AppStore ve Google Play Store\'da!",
    url: "http://facebook.github.io/react-native/",
    subject: data.name + " Challange" //  for email
    };
    return(

        <TouchableOpacity  onPress={()=>this.openCampaignPage(this,0)}>
          <View  style={styles.container} >
            <View style={{flexDirection:'row',margin:5,width:width*90/100,alignItems:'center'}} >

            <Text  style={{width:width*85/100,color:'#0097a7',fontSize:width/13,textAlign:'center',fontWeight:'bold'}}>
            {data.name?data.name:'Isimsiz'}
            </Text>


            <TouchableOpacity onPress={()=>this.setState({modalVisible:true})} style={{marginRight:width/50,position: "absolute",width:width/13,marginTop:height/75}}>
              <Icon name="ellipsis-v" size={width/13} style={{color:'#0097a7',marginLeft:width/30}}/>
            </TouchableOpacity>
            </View>
            <View style={{flexDirection:'column',flex:1,margin:3}}>
              {data.shortDescription?
              <Text style={styles.text}  >
                {data.shortDescription}
              </Text>
              :
            <View/>
            }
            {data.coverPicture?
              <Image source={{uri:(NetworkCon.DOMAIN + data.coverPicture)}} style={styles.image}/>
              :
              <View/>
            }
              <View style={{flexDirection:'row',marginTop:height/100,marginBottom:height/200,justifyContent:'space-between',alignSelf:'center',width:width*90/100}}>
                  <TouchableOpacity onPress={()=>{SocialMethods.share(shareOptions)}}>
                    <View style={{flexDirection:'row',alignItems:'center',width:width*21/100}}>
                      <Icon name="share-alt" size={width/13} style={{color:'#0097a7'}} />
                      <Text style={{margin:3,color:'#0097a7',fontWeight:'bold',fontSize:width/35}}>Paylas</Text>
                      <View style={{backgroundColor:'#0097a7',
                          padding:2,
                          width:width*0.18,
                          position:'absolute',
                          left:-width*0.001,
                          height:width*0.06,
                          bottom:-width*0.070,
                          borderColor:'#e7e7e7',
                          borderRadius:10,
                          elevation:6,
                          shadowOffset:{width:1,height:3},
                          shadowColor:'#616161',
                          shadowRadius: 3,
                          shadowOpacity:1,
                          alignItems:'center',
                          justifyContent:'center'}}>
                          <View style={{width:width*0.1,padding:width*0.001,
                            borderColor:'#e7e7e7',
                            borderRadius:10,
                            elevation:6,
                            shadowOffset:{width:1,height:3},
                            shadowColor:'#616161',
                            shadowRadius: 3,
                            shadowOpacity:1,
                            backgroundColor:'#e7e7e7',
                            alignItems:'center'}}>
                        <Text style={{backgroundColor:'transparent',bottom:width*0.008,textAlign:'center',fontWeight:'bold',height:width*0.044,width:width*0.06,color:'#0097a7',fontSize:width*0.050}}>∞</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={SocialMethods.follow.call(this,'Campaign',this.props.data?this.props.data._id:undefined)}>
                    <View style={{flexDirection:'row',alignItems:'center',width:width*21/100}}>
                      <Icon name="bell" size={width/13} style={{color:this.state.notificationButton?'#1560BD':'#0097a7'}}/>
                      <Text style={{margin:3,color:'#0097a7',fontWeight:'bold',fontSize:width/35}}>Takip</Text>
                      <View style={{backgroundColor:'#0097a7',
                          padding:2,
                          width:width*0.18,
                          position:'absolute',
                          left:-width*0.001,
                          height:width*0.06,
                          bottom:-width*0.070,
                          borderColor:'#e7e7e7',
                          borderRadius:10,
                          elevation:6,
                          shadowOffset:{width:1,height:3},
                          shadowColor:'#616161',
                          shadowRadius: 3,
                          shadowOpacity:1,
                          alignItems:'center',
                          justifyContent:'center'}}>
                          <View style={{width:width*0.1,padding:width*0.001,
                            borderColor:'#e7e7e7',
                            borderRadius:10,
                            elevation:6,
                            shadowOffset:{width:1,height:3},
                            shadowColor:'#616161',
                            shadowRadius: 3,
                            shadowOpacity:1,
                            backgroundColor:'#e7e7e7',
                            alignItems:'center'}}>
                        <Text style={{textAlign:'center',fontWeight:'bold',height:width*0.044,width:width*0.07,color:'#0097a7',fontSize:width*0.034}}>{this.state.numberOfFollowers}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={SocialMethods.up.call(this,'Campaign',this.props.data?this.props.data._id:undefined)}>
                    <View style={{flexDirection:'row',alignItems:'center',width:width*21/100}}>
                    <Icon name="arrow-up" size={width/13} style={{color:this.state.upButton?'#1560BD':'#0097a7'}}/>
                    <Text style={{margin:3,color:'#0097a7',fontWeight:'bold',fontSize:width/35}}>Yukari</Text>
                    <View style={{backgroundColor:'#0097a7',
                        padding:2,
                        width:width*0.18,
                        position:'absolute',
                        left:-width*0.001,
                        height:width*0.06,
                        bottom:-width*0.070,
                        borderColor:'#e7e7e7',
                        borderRadius:10,
                        elevation:6,
                        shadowOffset:{width:1,height:3},
                        shadowColor:'#616161',
                        shadowRadius: 3,
                        shadowOpacity:1,
                        alignItems:'center',
                        justifyContent:'center'}}>
                        <View style={{width:width*0.1,padding:width*0.001,
                          borderColor:'#e7e7e7',
                          borderRadius:10,
                          elevation:6,
                          shadowOffset:{width:1,height:3},
                          shadowColor:'#616161',
                          shadowRadius: 3,
                          shadowOpacity:1,
                          backgroundColor:'#e7e7e7',
                          alignItems:'center'}}>
                      <Text style={{textAlign:'center',fontWeight:'bold',height:width*0.044,width:width*0.07,color:'#0097a7',fontSize:width*0.034}}>{this.state.numberOfPeopleLiked}</Text>
                      </View>
                    </View>
                    </View>
                  </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.openCampaignPage(this,2)}>
                  <View style={{flexDirection:'row',alignItems:'center',width:width*21/100,marginBottom:width*0.06}}>
                  <Icon name="commenting-o" size={width/13} style={{color:'#0097a7'}}/>
                  <Text style={{margin:3,color:'#0097a7',fontWeight:'bold',fontSize:width/35}}>Yorumlar</Text>
                  <View style={{backgroundColor:'#0097a7',
                      padding:2,
                      width:width*0.18,
                      position:'absolute',
                      left:width*0.016,
                      height:width*0.06,
                      bottom:-width*0.070,
                      borderColor:'#e7e7e7',
                      borderRadius:10,
                      elevation:6,
                      shadowOffset:{width:1,height:3},
                      shadowColor:'#616161',
                      shadowRadius: 3,
                      shadowOpacity:1,
                      alignItems:'center',
                      justifyContent:'center'}}>
                      <View style={{width:width*0.1,padding:width*0.001,
                        borderColor:'#e7e7e7',
                        borderRadius:10,
                        elevation:6,
                        shadowOffset:{width:1,height:3},
                        shadowColor:'#616161',
                        shadowRadius: 3,
                        shadowOpacity:1,
                        backgroundColor:'#e7e7e7',
                        alignItems:'center'}}>
                    <Text style={{textAlign:'center',fontWeight:'bold',height:width*0.044,width:width*0.07,color:'#0097a7',fontSize:width*0.034}}>{this.state.numberOfComments}</Text>
                    </View>
                  </View>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </View>
          <ModalBox overlayBackground={'transparent'}
            modalDidClose={() => this.setState({modalVisible: false})} offset={100} modalStyle={styles.modalStyle}   open={this.state.modalVisible}>
  <TouchableOpacity onPress={()=>this.setState({modalVisible:false})}
      style={[{position:'absolute',right:width*0.022,top:height*0.015,zIndex:1},styles.imageButtons]}>
    <Icon name="close" size={width/10} style={{color:'#e7e7e7'}} />
  </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.setState({modalVisible:false,anonim:true})}} style={{padding:4,alignSelf:'center',width:width*0.60,borderWidth:0,borderRadius:10,height:height*0.05,backgroundColor:'#e7e7e7',justifyContent:'center',elevation:6,
                    shadowOffset:{width:1,height:3},
                    shadowColor:'#616161',
                    shadowRadius: 3,
                    shadowOpacity:1,
                    margin:height*0.01}}>
                  <Text style={{textAlign:'center',color:'#0097a7',fontWeight:'400'}}>Sikayet Et!</Text>
                </TouchableOpacity>
          </ModalBox>
        </TouchableOpacity>


    );
  }
}

var styles=StyleSheet.create({
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
  image:{
    height:height*33/100,
    alignSelf:'center',
    width:width*9/10,
    margin: 5,
    borderRadius:10,
    zIndex:0
  },
  text:{
    alignSelf:'center',
    width:width*0.89,
    fontSize:width/25,
    color:'#212121',
    textAlign:'auto',
    margin:5
  },
  modalStyle:{
    position:'absolute',
    right:width*0.02,
    width:width*0.925,
    top:height*0.05,
    height:height*0.10,
    backgroundColor:'#0097a7',
    borderColor:'#e7e7e7',
    borderRadius:10,
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
  },
  imageButtons:{
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
    backgroundColor:'transparent'
  },
})


module.exports = ButtonThing;
