import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  InteractionManager,
  Picker,
  Alert,
  Modal
} from 'react-native';
import DropDown, {
  Select,
  Option,
  OptionList,
} from 'react-native-selectme';
const Item = Picker.Item;
import Button from 'apsl-react-native-button'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/FontAwesome';
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var Background = require('./Background');
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;
var NavBar = require('./NavBar');
var ShareThing = require('./ShareThing');
var SubChallangeButton = require('./SubChallangeButton');
var EventCreate = require('./EventCreate');
var CommentCreate = require('./CommentCreate');
var SubChallange = require('./SubChallange');

import ModalBox from 'react-native-simple-modal';
var ErrorJS = require('./Error');
var SocialMethods = require('./SocialMethods');

import ScrollableTabView from 'react-native-scrollable-tab-view'
import * as Progress from 'react-native-progress';

var CustomTabBar = require('./CustomTabBar');
export default class EventScene extends Component{
  constructor(props){
    super(props);
    if(!this.props.info.data){
      console.error("no info.data!");
      return;
    }
    this.state = {
        modalVisible: false,
        isLoading: true,
        data: undefined,
        numberOfShares:5,
        canada: '',
        modalVisible:false,
        selected:'7',
        hasJoined:false,
        comments:[],
        isLoading:true,
        error:false,
        length:0,
        completed:0,
        startDate:undefined,
        initial:'',
        subNumber:5,
        gunChecker:false,
        subChallenges:[{definition:"adsfafds",name:"sadfasf"}],
        commentsScrollTo:false,
        commentsContentHeight:0,
        errorPage:this.props.info.initialPage,
        notificationButton:this.props.info.data.followed,
        upButton:this.props.info.data.liked,
        numberOfFollowers:this.props.info.data.numberOfFollowers,numberOfPeopleLiked:this.props.info.data.numberOfPeopleLiked,
    }
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.checkChallenge();
      this.loadTheContent();
    });

  }
  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }
  navSubChallengePage(definition){
    this.props.navigator.push({
      component:SubChallange,
      definition:definition
    })
  }

  loadTheContent(){
    console.log("ERRRRRRRRRRRRRRRRRRRORRRRRRrrr");

    let context = this;
    if(!this.props.info){
      //EventScene Started Without necessary info
      //So, exit the loadTheContent Method
      context.setState({isLoading:false})
      return;
    }
    var json = {
      _id: this.props.info.data._id
    };
    Fetch('getCampaignDetails','POST',json,null,function(response){

      console.log("ALLLLLLL1243124124124LLLLAHHH");
      console.log(response);
      if(response != undefined){
        //Success
        var subNumber=response.subChallenges? response.subChallenges.length : 1;
        context.setState({isLoading:false,data:response,subNumber:subNumber});
        console.log("process succeed!");

        context.setState({isLoading:false,subChallenges:response.subChallenges,data:response});
        console.log("asdfasf");

      }else{
        // TODO implement Error Handling
        console.log("process failed! What ");
      }
    });
  }
  loadTheComments(comments,bottomLimit,topLimit){
    if(!comments){
      return;
    }
    if(!this.state.isLoading)
      this.setState({isLoading:true});

    var json = {
      commentIDs: comments.slice(bottomLimit,topLimit)
    };
    let context = this;
    Fetch('getFewComments','POST',json,null,function(response){
      if(response != undefined && response.length != undefined && response.length != 0){
        //Success
        console.log("got comments!");
        console.log(response[0]);
        context.setState({comments:context.state.comments.length>bottomLimit?response:context.state.comments.concat(response),isLoading:false,commentsScrollTo:bottomLimit>0});
      }else{
        context.setState({error:true,errorPage:2});
        console.log("process failed!");
      }
    });
}
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  navBack(){
    this.props.navigator.pop();
  }

  onValueChange = (key: string, value: string) => {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  };


  renderTheStory(isLoading,data){
    console.log(data);
    if(!isLoading && data!==undefined){
    var descriptionInfo = (typeof data.detailedDescription == 'string')?JSON.parse(data.detailedDescription):[];
    var descriptionPictures = (typeof data.detailedDescription == 'string')?JSON.parse(data.descriptionPictures):[];
    var rows = [];
    var imageIndex = 0;
    for(var i = 0;i<descriptionInfo.length;i++){
      var info = descriptionInfo[i];
      if(info.type === 'img'){
        rows.push(<Image key={i} style={{margin:8,borderRadius:5,height:300,width:width-16}} source={{uri:NetworkCon.DOMAIN + descriptionPictures[imageIndex++] }} />);
      }else{
        rows.push(<Text key={i} style={{color:'#e7e7e7',margin:8,width:width-16,fontSize:15}}>
          {info.content}
          </Text>);
      }
    }
    if(descriptionInfo.length==0){
      return (
        <Text key={0} style={{alignSelf:'center',paddingTop:height*0.18,color:'#e7e7e7',fontSize:height*0.04,fontWeight:'400'}}>Aciklama Yok!</Text>
      )
    }else{
      return rows;
    }
  }else{
    return (  <ActivityIndicator
               animating={this.state.isLoading}
               color="#e7e7e7"
               size="large"
               style={{alignSelf:'center',paddingVertical:height*3/10}}
             />);
  }
  }
   dayCalculator(d,m,y){
     // The number of milliseconds in one day
   var ONE_DAY = 1000 * 60 * 60 * 24;

   // Convert both dates to milliseconds
   var date1_ms = new Date();
   var date2_ms = new Date(y,m-1,d);

   // Calculate the difference in milliseconds
   var difference_ms = Math.abs(date1_ms - date2_ms)

   // Convert back to days and return
   return Math.round(difference_ms/ONE_DAY)
   }
   // sends the completed number of the subchallenge
  sendCompleted(){
    var context=this;
    var json={};
    console.log("$$$$$$$$$$$$$$$$$")
    json.completedNumber=this.state.completed+1;
    json.challengeId=context.props.info.data._id;
    json.name=context.props.info.data.name;

    Fetch('sendCompleted','POST',json,null,function(response){
      console.log("ppppppppppPPPPPPPPPPPPPP"+response);
      if(response==1){
        console.log("goood");
        context.setState({
          completed:context.state.completed+1,
        });




      }else{
        //TODO error handling
        console.log("ALLAH BELANI VERSIN");
      }
    });
  }
  renderMyStatue(data){
    var context=this;

  if(this.state.hasJoined){
    console.log("(((((((((((((((((((((((((((((((((((())))))))))))))))))))))))))))))))))))"+data);
}
    if(true){
      console.log("GGGGGGGGGGGGGg"+this.state.subNumber+this.state.completed);
      var start=[];
      if(this.state.hasJoined){

         var starter=context.state.initial;
        var start=starter.split('/');
      }
      for(var i=0;i<3;i++){
        console.log("++++"+start[i]);
      }
      var difference=this.dayCalculator(start[0],start[1],start[2])-this.state.completed;
      if(difference==0) context.setState({gunChecker:true});
        var rows = [];
        data = {};
        var length=difference;
        if(difference>7) return this.leaveChallenge();
        var completed=this.state.completed;
        console.log("his.state.complete"+this.state.completed)
        var ju=Math.floor(completed/4)-1;
        for(var j=0,len=Math.floor(completed/4);j<len;j++){
          rows.push(
            <View key={-j} style={{alignSelf:'center',backgroundColor:"transparent",flexDirection:'row'}}>
              <SubChallangeButton subChallangeButtonStyle="square" succeed={true} subChallangeNumber={"" + (4*j+1)}/>
              <SubChallangeButton subChallangeButtonStyle="square" succeed={true} subChallangeNumber={"" + (4*j+2)}/>
              <SubChallangeButton subChallangeButtonStyle="square" succeed={true} subChallangeNumber={"" + (4*j+3)}/>
              <SubChallangeButton subChallangeButtonStyle="square" succeed={true} subChallangeNumber={"" + (4*j+4)}/>
            </View>
          )

        }

        var hi = Math.floor(completed/4);
        var el = [];
        var count=completed%4;
        for(var i = 1,len=completed%4;i<=len;i++){
          el.push(
            <SubChallangeButton key={i} succeed={true} subChallangeButtonStyle="square" subChallangeNumber={i+4*hi}/>
            );

        }
        rows.push(
          <View key={80} style={{alignSelf:'center',backgroundColor:"transparent",flexDirection:'row'}}>
            {el}
          </View>
        );
        for(var i = 0,len =3+ Math.floor(length/4);i<len;i++){
          rows.push(
            <View key={-(i+1+ju)} style={{alignSelf:'center',backgroundColor:"transparent",flexDirection:'row'}}>
              <SubChallangeButton onPress={()=>this.sendCompleted()} subChallangeButtonStyle="square" subChallangeNumber={"" + (4*(i+ju+1)+1+count)}/>
              <SubChallangeButton onPress={()=>this.sendCompleted()} subChallangeButtonStyle="square" subChallangeNumber={"" + (4*(i+ju+1)+2+count)}/>
              <SubChallangeButton onPress={()=>this.sendCompleted()} subChallangeButtonStyle="square" subChallangeNumber={"" + (4*(i+ju+1)+3+count)}/>
              <SubChallangeButton onPress={()=>this.sendCompleted()} subChallangeButtonStyle="square" subChallangeNumber={"" + (4*(i+ju+1)+4+count)}/>
            </View>
          );
        }
         var hi2 = Math.floor(length/4);
         el = [];
         var lo=Math.floor(length/4)-1;
        for(var i = 1,len=length%4;i<=len;i++){
          el.push(
            <SubChallangeButton onPress={()=>this.sendCompleted()}  key={i+count} subChallangeButtonStyle="square" subChallangeNumber={count+i+4*(lo+hi+1)}/>
            );
        }
        rows.push(
          <View key={90} onPress={()=>this.sendCompleted()} style={{alignSelf:'center',backgroundColor:"transparent",flexDirection:'row'}}>
            {el}
          </View>
        );
        return rows;
    }else{
      var rows=[];
      for(var i=1;i<=this.state.subNumber;i++){
        var data=context.state.subChallenges[0];

        rows.push(
          <SubChallangeButton key={i} subChallangeNumber={i} definition={data.definition||"tanım yok"} subChallangeName={data.name||"sfdsfd"} onPress={this.navSubChallengePage.bind(this,data.definition)}  navigator={this.props.navigator}/>
        );
      }

      return rows;
    }

  }
  renderComments(data,comments){
    if(data && comments.length == 0 && data.comments.length > 0){
      this.loadTheComments(data.comments,0,5);
    }
      var row = [];
      console.log(comments);
      for(var i =0;i<comments.length;i++){
        console.log(comments[i]);
        row.push(<ShareThing key={comments[i]._id} data={comments[i]}/>);
      }
      if(data && comments.length !== data.comments.length && !this.state.isLoading){
      row.push(<TouchableOpacity key={comments.length} onPress={()=>this.loadTheComments(data.comments,comments.length,comments.length+5)} style={{
              alignSelf:'center',
              width:width*97/100,
              marginTop:8,
              marginBottom:8,
              padding:8,
              backgroundColor:'#e7e7e7',
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
      if(this.state.isLoading){
        row.push(<ActivityIndicator
                  key={comments.length}
                   animating={true}
                   color="#e7e7e7"
                   size="large"
                   style={{alignSelf:'center',paddingVertical:height*0.15}}
                 />);
      }
      return row;
    }
    newCommentSent(newComment){
      var comments = this.state.comments;
      comments.splice(0,0,newComment);
      this.setState({comments:comments});
    }
  //makes user leave the challenge
  leaveChallenge(){
    var context=this;
    var json={};
    json.startDate=this.state.initial;
    json.challengeName=this.props.info.data.name;
    json.challengeId=this.props.info.data._id;
    Fetch('leaveChallenge','POST',json,null,function(response){
      if(response==1){

      }else{
        //TODO ERROR HANDLing
      }
    })
  }
  //checks if the user is already in the challenge
  checkChallenge(){
    var context=this;
    var json={};
    json.challengeId=context.props.info.data._id;
    console.log("AAAAAAA111111111AA");

    Fetch('checkChallenge','POST',json,null,function(response){
      console.log("AAAAAAAAA"+response);
      if(response.completed>=0){
        console.log("UUUUUUUUUUUUUUUUFFFFFFFFFFFFff  "+"11111  "+response.startDate+"//////");
        context.setState({
          hasJoined:true,
          completed:response.completed,
          initial:response.startDate,
        });
      }else if(response==0){
        context.setState({
          hasJoined:false,
        });
      }else{
        console.log("ERRRRORRRR");
      }
    })

  }

  //makes the user join to the challenge
  joinChallenge(){
    var context=this;
    //gives json challengeId,startDate,and day number
    var json={};

    json.challengeId=context.props.info.data._id;
    json.name=context.props.info.data.name;
    json.coverPicture=context.props.info.data.coverPicture;
    console.log(context.props.info.data.shortDescription+"999999999999");
    json.shortDescription=context.props.info.data.shortDescription;
    //calculates the current date and gives it to server as startDate
    var dateee = new Date();
    var wholeDate = dateee.getDate() + '/' + (dateee.getMonth() + 1) + '/' + dateee.getFullYear()  ;
    json.startDate=wholeDate;
    json.completed=0;
    Fetch('joinChallenge','POST',json,null,function(response){
      //TODO handle the possible errors
      if(response!=1){
        Alert.alert(
            'Alert Title',
            "alertMessage",
          )
      }
    });
  }
  //renders the joinleave button
  renderButton(){
    if(this.state.hasJoined){
      return this.leaveChallenge();
    }else{
      return this.joinChallenge();
    }
  }
  renderTheText(){
    if(!this.state.hasJoined){
      console.log("77777777777777777777777"+this.state.completed);
      return(
        <Text style={{fontSize:height/25,color:'#e7e7e7',fontWeight:'bold',marginTop:height/20,textAlign:'center'}}>Challenge a katılmaya ne dersin?</Text>

      );
    }else{
      return(
        <View>
        <Text style={{fontSize:height/35,fontWeight:'600',marginTop:height/60,color:'#e7e7e7',textAlign:'center'}}>{this.state.gunChecker?"Bugünkü adımı tamamladın":"Bugünkü adımı tamamlamadın"}</Text>
<Text style={{fontSize:height/25,color:'#e7e7e7',fontWeight:'bold',marginTop:height/20,textAlign:'center'}}>{this.state.completed}. gün</Text>
</View>

      );
    }
  }
  render(){
    var sharesScroolView = ScrollView;
    return(

      <View style={styles.container}>
          <Background height={height} width={width}/>
         <NavBar onPressIcon={this.navBack.bind(this)} height={height/12} width ={width} color= "#e7e7e7"  text = {this.props.info ? this.props.info.data.name : "no name"} iconName="arrow-left" search ={false} settings={false}/>
{this.state.error?
  <ErrorJS errorTitle={"Baglanti Problemi!"}
            errorText={"Internet Baglantisi Calismiyor\nLutfen baglantinizi kontrol edin"}
              callback={()=>{
                this.setState({error:false});
                }}/>
    :
    <View/>
  }
  <View style={{backgroundColor:'#e7e7e7',marginTop:height*0.08,height:height*0.1}}>
  <View style={{flexDirection:'row',marginTop:height/100,marginBottom:height/200,justifyContent:'space-between',alignSelf:'center',width:width*90/100}}>
      <TouchableOpacity onPress={()=>{
          let shareOptions = {
          title: this.props.info.data.name + " Challange",
          message: this.props.info.data.name + " Challange seni bekliyor. ChallangeApp kullanarak katil!\nChallangeApp simdi AppStore ve Google Play Store\'da!",
          url: "http://facebook.github.io/react-native/",
          subject: this.props.info.data.name + " Challange" //  for email
          };
          SocialMethods.share(shareOptions);
        }}>
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
      <TouchableOpacity onPress={SocialMethods.follow.call(this,'Campaign',this.props.info.data?this.props.info.data._id:undefined)}>
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
      <TouchableOpacity onPress={SocialMethods.up.call(this,'Campaign',this.props.info.data?this.props.info.data._id:undefined)}>
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
  </View>
</View>
<ScrollableTabView  renderTabBar={() => <CustomTabBar underlineStyle={{backgroundColor:'#e7e7e7'}} />} tabBarTextStyle={{color:'#e7e7e7'}} initialPage={this.props.info.initialPage?this.props.info.initialPage:0}>
          <ScrollView  tabLabel="Hikaye" style={{height:height*0.6}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View>
                <Text style={styles.eventInfoTextStyle}>
                  capslock Oluşturdu
                </Text>
                <Text style={styles.eventInfoTextStyle}>
                  251 katılım
                </Text>
              </View>
              <View>
                <Button  onPress={()=>this.setState({modalVisible:true})} style={{backgroundColor:'#e7e7e7',width:width/4,borderWidth:0,borderRadius:15,marginRight:width/20,height:height/12}} textStyle={{color:'#0097a7',fontSize:width/22,fontWeight:'bold'}}>
                {this.state.hasJoined?"AYRIL":"KATIL"}
                </Button>

              </View>
            </View>
            <ModalBox overlayBackground={'transparent'}
    modalDidClose={() => this.setState({modalVisible: false})} offset={100} modalStyle={styles.modalStyle}   open={this.state.modalVisible}>
              <View>
              {this.state.hasJoined?(<Text style={[styles.modalTextStyle,{marginTop:height/40}]}>
              Emin Misiniz?
              </Text>):(<Text style={styles.modalTextStyle}>
                Challenge gün sayınızı seçin
              </Text>)}
                <Picker
                         style={{height:this.state.hasJoined?0:height/10}}
                         selectedValue={this.state.selected}
                         onValueChange={this.onValueChange.bind(this, 'selected')}>
                         <Item label="1 hafta" value="7" />
                         <Item label="2 hafta" value="14" />
                         <Item label="1 ay" value="30" />
                         <Item label="3 ay" value="90" />
                         <Item label="6 ay" value="180" />
                         <Item label="1 yıl" value="365" />

                  </Picker>
                  <Button onPress={()=>{this.renderButton();this.setState({modalVisible:false})}} textStyle={{color:'#e7e7e7'}} style={{marginTop:this.state.hasJoined?height/20:0,alignSelf:'center',width:width/4,borderWidth:0,borderRadius:15,height:height/12,backgroundColor:'#0097a7'}}>
                    {this.state.hasJoined?"AYRIL":"KATIL"}
                  </Button>
              </View>


            </ModalBox>
          {this.renderTheStory(this.state.isLoading,this.state.data)}
          </ScrollView>

        <View tabLabel="Durum">
          <ScrollView style={{
              height:height*0.65,
            }}>

            <View>
            {this.renderMyStatue(this.state.data)}
              </View>
          </ScrollView>
          <View style={{alignSelf:'center',margin:8,}}>
            {this.renderTheText()}
          </View>
        </View>

        <View tabLabel="Yorumlar" style={{height:height*0.71}}>
          <ScrollView ref={(scrollview)=>{CommentsScroolView = scrollview;}} style={{height:height*0.713,}}
            onContentSizeChange={(contentWidth, contentHeight)=>{
              if(this.state.commentsScrollTo){
                CommentsScroolView.scrollTo({y: this.state.commentsContentHeight*0.97});
                this.setState({commentsContentHeight:contentHeight,commentsScrollTo:false});
              }else{
                this.setState({commentsContentHeight:contentHeight});
              }
            }}>



            <CommentCreate username={this.props.username} campaignID={this.props.info.data._id} newCommentSent={this.newCommentSent.bind(this)}/>
            {this.renderComments.call(this,this.state.data,this.state.comments)}
          </ScrollView>
          <ActionButton buttonColor="#0097c7"  position="right" icon={<Icon name="angle-up" size={height/15} style={{color:'#e7e7e7',bottom:height/200}} />}
          onPress={()=>{
            CommentsScroolView.scrollTo({x: 0}); }}>
          </ActionButton>
        </View>

        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventInfoTextStyle:{
    color:'#e7e7e7',
    fontSize:width/22,
    marginLeft:width/40
  },
  modalStyle:{
    marginLeft:width/8,
    width:width*3/4,
    height:height/4
  },
  modalTextStyle:{
    fontSize:width/20,
    fontWeight:'bold',
    color:'#0097a7',
    alignSelf:'center'
},
  picker:{

marginLeft:width/4
  },
navBar:{
    height: height/11,
   width: width ,
    position: 'absolute',
    top:0,
    left:0,
    backgroundColor: '#0097a7',

    marginLeft:width/25,
    flexDirection:'row'
  },
});

module.exports=EventScene;
