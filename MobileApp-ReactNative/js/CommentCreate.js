import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Dimensions,
  Picker,
  Item,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;
var MediaHandler = require('./MediaHandler');
import ModalBox from 'react-native-simple-modal';
var Comment = require('./Comment');
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;


export default class CommentCreate extends Component{
  constructor(props){
    super(props);
      this.state = {
        TextInputHeight:height*0.07,
        text:"",
        isLoading:false,
        sent:false,
        imageSource:undefined,
        videoSource:undefined,
        modalVisible:false,
        anonim:false,
        invalidProfilePic:false,
      }
  }
  createComment(){
    if(!this.state.isLoading){
      this.setState({isLoading:true});
    }
    console.log('is Anonim:' + this.state.anonim);
    var json = {
      campaignID: this.props.campaignID,
      text: this.state.text,
      anonim:this.state.anonim,
    };
    var files = {};
    if(this.state.imageSource){
      files.photo = [{source : this.state.imageSource},{source : this.state.imageSource},{source : this.state.imageSource}];
    }else if(this.state.videoSource){
      files.video = {source : this.state.videoSource};
    }
    var context = this;
    Fetch('createComment','POST',json,files,function(response){
      console.log("RESPONSE : " +response);
      if(response.state == "1"){
        //Success
        console.log("process succeed!");
        //console.log(response[0]);
        setTimeout(function(){
           context.setState({sent:false},context.props.newCommentSent(response.comment));
         }, 3000);
        context.setState({text:"",imageSource:undefined,isLoading:false,sent:true});
      }else{
        context.setState({isLoading:false});
        console.log("process failed!");
      }
    });
  }
  textInputHeightHandler(event){
    if(this.state.TextInputHeight != event.nativeEvent.contentSize.height){
      this.setState({TextInputHeight: event.nativeEvent.contentSize.height});
    }
  }
  onValueChange = (key: string, value: string) => {
    var newState = {};
    newState[key] = value;
    this.setState(newState);
  };
  render(){
    if(this.state.isLoading){
      return (
        <TouchableOpacity  style={styles.container} >
        <ActivityIndicator
                 animating={true}
                 color="#0097a7"
                 size="large"
                 style={{alignSelf:'center',paddingVertical:height*1/10}}
               />
        </TouchableOpacity>
             );
    }
    if(this.state.sent){
      return (
        <TouchableOpacity  style={styles.container} >
          <Icon name="check" size={height/10} style={{color:'#0097a7',alignSelf:'center',paddingVertical:height*1/10}}/>
        </TouchableOpacity>
             );
    }
    var uri = NetworkCon.PROFILEPICS + this.props.username;
    var video = undefined;
    var media = undefined;
    if(video){
      //TODO set media to VIDEO COMPONENT
    }else if(this.state.imageSource){
      media = <Image source={{uri:this.state.imageSource}} style={styles.image}/>;
    }

    var profilePic = this.state.anonim || !uri || this.state.invalidProfilePic ? <Icon name="user-o" size={height/15} style={{color:'#0097a7'}} /> : <Image style={styles.avatar} onError={()=>this.setState({invalidProfilePic:true})} source={{uri:uri}}/>;
    return(
      <View>
        <TouchableOpacity  style={styles.container} >
          <View style={{flexDirection:'row',margin:5,width:width*90/100,height:height/15,alignItems:'center'}}>
          {profilePic}
          <Text style={{margin:5,fontSize:height/40,color:'#0097a7'}}>
            {this.state.anonim||!this.props.username?"Anonim":this.props.username}
          </Text>
          <TouchableOpacity onPress={()=>{this.setState({modalVisible:true})}} style={{position: "absolute",right: -width*0.02}}>
            <Icon name="gear" size={width/10} style={{color:'#0097a7'}}/>
          </TouchableOpacity>
          </View>
          <View style={{flexDirection:'column',flex:1,margin:3}}>
            <TextInput onChangeText={(text) => this.setState({text})} onContentSizeChange={this.textInputHeightHandler.bind(this)} placeholder="Bir seyler yazin..." multiline={true} style={{width:width*0.95,height:this.state.TextInputHeight,borderRadius:20,alignSelf:'center',color:'black',fontSize:width/18,padding:8,paddingTop:2}}/>
            {media ?
            <View style={{alignSelf:'center'}}>
              {media}
              <TouchableOpacity onPress={()=>this.setState({imageSource:undefined})}
                  style={[{position:'absolute',right:width*0.03,top:height*0.01,zIndex:1},styles.imageButtons]}>
                <Icon name="close" size={width/10} style={{color:'#0097a7'}} />
              </TouchableOpacity>
            </View>
            :
            <View style={{alignSelf:'center',borderColor:'#0097a7',borderRadius:20,borderWidth:2,padding:5}}>
            <Text style={{textAlign:'center',color:'#9E9E9E'}}>Fotograf veya Video Ekle</Text>
            <View style={{flexDirection:'row',alignSelf:'center'}}>
              <TouchableOpacity   onPress={()=>{
                var context = this;
                MediaHandler.selectPhoto(function(imageSource){
                    context.setState({imageSource:imageSource});
                  });
                }}
                style={{margin:4,marginRight:width*0.04}}>
                <Icon name="camera" size={height/10} style={{color:'#0097a7'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{margin:4}}>
                <Icon name="video-camera" size={height/10} style={{color:'#0097a7'}} />
              </TouchableOpacity>
            </View>
            </View>
          }
          </View>
            <TouchableOpacity style={{
                padding:6,
                margin:4,
                width:width*0.93,
                backgroundColor:'#e7e7e3',
                borderColor:'#e7e7e7',
                borderRadius:10,
                elevation:6,
                shadowOffset:{width:1,height:3},
                shadowColor:'#616161',
                shadowRadius: 3,
                shadowOpacity:1,}}
                onPress={this.createComment.bind(this)}>
              <Text style={{textAlign:'center',fontWeight:'bold',color:'#0097A7'}}>Paylas</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <ModalBox overlayBackground={'transparent'}
  modalDidClose={() => this.setState({modalVisible: false})} offset={100} modalStyle={styles.modalStyle}   open={this.state.modalVisible}>
  <TouchableOpacity onPress={()=>this.setState({modalVisible:false})}
      style={[{position:'absolute',right:width*0.022,top:height*0.01,zIndex:1},styles.imageButtons]}>
    <Icon name="close" size={width/10} style={{color:'#e7e7e7'}} />
  </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.setState({modalVisible:false,anonim:true})}} style={{padding:4,alignSelf:'center',width:width*0.85,borderWidth:0,borderRadius:10,height:height*0.05,backgroundColor:'#e7e7e7',justifyContent:'center',elevation:6,
                    shadowOffset:{width:1,height:3},
                    shadowColor:'#616161',
                    shadowRadius: 3,
                    shadowOpacity:1,
                    margin:height*0.01}}>
                  <Text style={{textAlign:'center',color:'#0097a7',fontWeight:'400'}}>Anonim olarak Yorum Yap</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.setState({modalVisible:false,anonim:false})}} style={{padding:4,alignSelf:'center',width:width*0.85,borderWidth:0,borderRadius:10,height:height*0.05,backgroundColor:'#e7e7e7',justifyContent:'center',elevation:6,
                    shadowOffset:{width:1,height:3},
                    shadowColor:'#616161',
                    shadowRadius: 3,
                    shadowOpacity:1,
                    margin:height*0.01}}>
                  <Text style={{textAlign:'center',color:'#0097a7',fontWeight:'400'}}>{"(" + this.props.username+ ") Kullanici Adi ile Yorum Yap"}</Text>
                </TouchableOpacity>
          </ModalBox>
      </View>
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
    marginTop:height/100,
    marginBottom:height/100,
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
    width:width*9/10,
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
  modalStyle:{
    right:width*0.03,
    width:width*0.95,
    top:height/25,
    height:height*0.28,
    backgroundColor:'#0097a7',
    borderColor:'#e7e7e7',
    justifyContent:'center',
    borderRadius:10,
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
  },
})

module.exports = CommentCreate;
