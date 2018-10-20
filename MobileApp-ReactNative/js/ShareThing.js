import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
var Comment = require('./Comment');
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;

var EventScene=require('./EventScene');
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;
var SocialMethods = require('./SocialMethods');

export default class ShareThing extends Component{
  constructor(props){
    super(props);
    console.log("Notification" + this.props.notificationButton);
    this.state = {
     showSubComments:false,noSubComment:true,comments:[],newComment:"",isSubCommentLoading:false,isLoading:false,sent:false,
     notificationButton:this.props.data?this.props.data.followed:false,
     upButton:this.props.data?this.props.data.liked:false,newCommentHeight:40,
     invalidProfilePic:false,
   }
  }
  openCampaignPage(){
    this.props.navigator.push({
        component: EventScene,
        info: {_id:this.props.data?this.props.data._id:undefined,name:this.props.data?this.props.data.name:'no name'}
    });
  }
  loadSubComments(comments,bottomLimit,topLimit){
    if(!comments || comments.length == 0){
      this.setState({isSubCommentLoading:false,noSubComment:true});
      return;
    }
      if(!this.state.isSubCommentLoading)
        this.setState({isSubCommentLoading:true,noSubComment:false});

      var json = {
        commentIDs: comments.slice(bottomLimit,topLimit)
      };
      let context = this;
      Fetch('getFewComments','POST',json,null,function(response){
        if(response != undefined && response.length != undefined && response.length != 0){
          //Success
          console.log("got comments!");
          console.log(response[0]);
          context.setState({comments:context.state.comments.length>bottomLimit?response:context.state.comments.concat(response),isSubCommentLoading:false,noSubComment:false});
        }else{
          //TODO implement ERROR HANDLER
          //context.setState({error:true,errorPage:2});
          console.log("process failed!");
        }
      });
  }
  handleDataUpdate(context,comments,i){
    return function(newData){
        comments[i] = newData;
        console.log(newData);
        context.setState({comments:comments});
      };
  }
  renderSubComments(data,comments){
    if(data && comments.length == 0 && data.subComments.length > 0){
      this.loadSubComments(data.subComments,0,5);
    }
      var row = [];
      if(comments.length>0){
        row.push(<View key={-1} style={{
                            width:width*0.91,
                            height:2,
                            backgroundColor:'#0097a7',
                            elevation:6,
                            shadowOffset:{width:1,height:3},
                            shadowColor:'#616161',
                            shadowRadius: 3,
                            shadowOpacity:1,
                }}/>);
      }
      for(var i =0;i<comments.length;i++){
        row.push(<Comment key={i} data={comments[i]}
                        handleDataUpdate={this.handleDataUpdate(this,comments,i)}/>);
      }
      if(data && comments.length < data.subComments.length && !this.state.isSubCommentLoading){
      row.push(<TouchableOpacity key={comments.length} onPress={()=>this.loadSubComments(data.subComments,comments.length,comments.length+5)} style={{
                alignSelf:'center',
                width:width*90/100,
                marginTop:16,
                padding:8,
                backgroundColor:'#e7e7e3',
                borderColor:'#e7e7e7',
                borderRadius:10,
                elevation:6,
                shadowOffset:{width:1,height:3},
                shadowColor:'#616161',
                shadowRadius: 3,
                shadowOpacity:1,}}>
              <Text style={{color:'#0097a7',fontWeight:'bold',textAlign:'center'}}>Daha Fazla Yorum Goruntule</Text>
            </TouchableOpacity>);
        }
      if(this.state.isSubCommentLoading){
        row.push(<ActivityIndicator
                  key={comments.length}
                   animating={true}
                   color="#e7e7e7"
                   size="large"
                   style={{alignSelf:'center',paddingVertical:height*0.01}}
                 />);
      }
      if(this.state.noSubComment){
        row.push(<View style={{alignSelf:'center',paddingVertical:height*0.01}}>
                  <Text style={{color:'#0097a7',fontSize:height/40,textAlign:'center'}}>{"Yorum Yok.\nIlk yorumu siz yapin :)"}</Text>
                </View>);
      }
      return row;
    }
   newCommentContentSizeHandle(event){
     if(this.state.newCommentHeight != event.nativeEvent.contentSize.height){
       this.setState({newCommentHeight: event.nativeEvent.contentSize.height});
     }
  }
  createSubComment(data){
    if(!this.state.isLoading){
      this.setState({isLoading:true,noSubComment:false});
    }
    var json = {
      commentID: data._id,
      text: this.state.newComment,
    };
    var context = this;
    Fetch('createSubComment','POST',json,null,function(response){
      console.log("RESPONSE : " +response);
      if(response.state == "1"){
        //Success
        console.log("process succeed!");
        //console.log(response[0]);
        setTimeout(function(){
          var comments = context.state.comments;
           comments.splice(0,0,response.comment);
           context.setState({sent:false,comments:comments,showSubComments:true,noSubComment:false});
         }, 3000);
        context.setState({newComment:"",isLoading:false,sent:true});
      }else{
        context.setState({isLoading:false});
        console.log("process failed!");
      }
    });
  }
  render(){
    var data = this.props.data || {};
    var uri = NetworkCon.PROFILEPICS + data.username;
    var media = undefined;
    if(data.video){
      //TODO implement video player
    }else if (data.photo) {
        media = <Image source={{uri:NetworkCon.DOMAIN + data.photo}} style={styles.image}/>;
    }

    var profilePic = !uri || this.state.invalidProfilePic ? <Icon name="user-o" size={height/15} style={{color:'#0097a7'}} /> : <Image style={styles.avatar} onError={()=>this.setState({invalidProfilePic:true})} source={{uri}}/>;
    return(

        <TouchableOpacity  onPress={this.openCampaignPage.bind(this)}>
          <View  style={styles.container} >
            <View style={{flexDirection:'row',margin:5,width:width*90/100,height:height/15,alignItems:'center'}}>
            {profilePic}
            <Text style={{margin:5,fontSize:height/40,color:'#0097a7'}}>
              {data.username || "Anonim"}
            </Text>
            <TouchableOpacity style={{position: "absolute",right: 0}}>
              <Icon name="ellipsis-v" size={width/13} style={{color:'#0097a7'}}/>
            </TouchableOpacity>
            </View>
            <View style={{flexDirection:'column',flex:1,margin:3}}>
              {data.text ? <Text style={styles.text}>{data.text}</Text> : <View/>}
              {media ?
              <View style={{flexDirection:'row',alignItems:'center'}}>
                {media}
              </View>
              :
              <View/>
              }

              <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:height/90,paddingLeft:width/40,alignSelf:'center',width:width*90/100,height:height/20,paddingRight:width/40}}>
                  <TouchableOpacity>
                    <View style={{flexDirection:'row',alignItems:'center',width:width*21/100}}>
                      <Icon name="share-alt" size={width/13} style={{color:'#0097a7'}} />
                      <Text style={{margin:3,color:'#0097a7',fontWeight:'bold',fontSize:width/35}}>Paylas</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={SocialMethods.follow.call(this,'Comment',this.props.data?this.props.data._id:undefined)}>
                    <View style={{flexDirection:'row',alignItems:'center',width:width*21/100}}>
                      <Icon name="bell" size={width/13} style={{color:this.state.notificationButton?'#1560BD':'#0097a7'}}/>
                      <Text style={{margin:3,color:'#0097a7',fontWeight:'bold',fontSize:width/35}}>Takip</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={SocialMethods.up.call(this,'Comment',this.props.data?this.props.data._id:undefined)}>
                    <View style={{flexDirection:'row',alignItems:'center',width:width*21/100}}>
                    <Icon name="arrow-up" size={width/13} style={{color:this.state.upButton?'#1560BD':'#0097a7'}}/>
                    <Text style={{margin:3,color:'#0097a7',fontWeight:'bold',fontSize:width/35}}>Yukari</Text>
                    </View>
                  </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.setState({showSubComments:!this.state.showSubComments})}>
                  <View style={{flexDirection:'row',alignItems:'center',width:width*21/100}}>
                  <Icon name="commenting-o" size={width/13} style={{color:'#0097a7'}}/>
                  <Text style={{margin:3,color:'#0097a7',fontWeight:'bold',fontSize:width/35}}>Yorumlar</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {this.state.isLoading?
                <ActivityIndicator
                         animating={true}
                         color="#0097a7"
                         size="large"
                         style={{alignSelf:'center'}}
                       />
                :
                <View/>
              }
              {this.state.sent?
                <Icon name="check" size={height/10} style={{color:'#0097a7',alignSelf:'center',paddingVertical:height*0.01}}/>
                :
                <View/>
              }
              {!this.state.isLoading && !this.state.sent ?
              <View style={{flexDirection:'row'}}>
              <View style={{
                marginTop:height/90,
                width:width*80/100,
                height:this.state.newCommentHeight*1.05,
                marginLeft:height/100,
                backgroundColor:'white',
                padding:5,
                paddingBottom:6,
                borderRadius:5,
                flexDirection:'row',
                alignItems:'center',
              }}>
              <TextInput onChangeText={(text)=>this.setState({newComment:text})} onContentSizeChange={this.newCommentContentSizeHandle.bind(this)} multiline={true} placeholder="Bir yorum yazin" style={{width:width*75/100,height:this.state.newCommentHeight,alignSelf:'center',fontSize:height/33}}/>
              </View>
              <TouchableOpacity onPress={()=>this.createSubComment.call(this,data)}>
                <Icon name="paper-plane" size={width/13} style={{color:'#0097a7',marginLeft:width/75,top:this.state.newCommentHeight-width/17,backgroundColor:'transparent'}} />
              </TouchableOpacity>
              </View>
              :
              <View/>
              }
            </View>
            {(this.state.showSubComments)?
            <View>
            <View style={{margin:8}}>
                {/*this.renderComments(data.subComments,this.state.numberOfComments)*/}
                {this.renderSubComments.call(this,this.props.data,this.state.comments)}
            </View>
          </View>
            :
            <View/>
            }
            </View>
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
})


module.exports = ShareThing;
