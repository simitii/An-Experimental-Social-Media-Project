import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import ActionButton from 'react-native-action-button'
import ScrollableTabView from 'react-native-scrollable-tab-view'
var CustomTabBar = require('./CustomTabBar');
import Drawer from 'react-native-drawer'
import Calendar from 'react-native-calendar';
import moment from 'moment';

import Icon from 'react-native-vector-icons/FontAwesome'
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
let Menu = require('./Menu');
var Background = require('./Background');
var NavBar = require('./NavBar');
var ButtonThing=require('./ButtonThing');
var ButtonThingForNews=require('./ButtonThingForNews');
var SettingsScene=require('./SettingsScene');
var EventCreate = require('./EventCreate');
var EventScene = require('./EventScene');
var Messages = require('./Messages');
var ErrorJS = require('./Error');
var ImprovementScene = require('./ImprovementScene');
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;

var ProfileScene=require('./profileeScene');
var isLoaded = [false,false,false];
var key = 0;
const customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
  'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var mainScrollView=null;

export default class MainPageScene extends Component {
  constructor(props) {
      super(props);
      this.state = {
                    isLoadingNewsfeed:true,
                    isRefreshingNewsfeed:false,
                    isLoadingMoreNewsfeed:false,
                    newsfeed:[],
                    newsfeedData:[],
                    isLoading: false,
                    refresh:false,
                    modalVisible: false,
                    drawer:false,
                    error:false,
                    selectedDate: moment().format(),
                    errorPage:0,
                    response:"",
                    inputNote:"",
                    note:"",
                    mainPageContentHeight:0,
                    scrollTo:false,
                  };
  }
  navSettings(){
    this.props.navigator.push({
       component: SettingsScene
      })
  }
  navImprovement(){
    this.props.navigator.push({
       component: ImprovementScene
      })
  }
  navProfile(){
    this.props.navigator.push({
      component: ProfileScene,
      info:{profileUserName: this.props.username},
    });
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  navMessages(){
    this.props.navigator.push({
      component: Messages
    });
  }
  navSearchResultFactory(type,_id,name,data){
    data.name = data.description;
    var navigate = {
      component: EventScene,
      info:{data:data},
    };
    if(type == 'user'){
      navigate = {
         component: ProfileScene,
         info:{profileUserName: _id},
        }
    }
    let context = this;
    return function(){
      context.props.navigator.push(navigate);
    }
  }
  componentDidMount(){
    if(this.state.newsfeed.length == 0){
      this.loadNewsfeed();
    }else if (this.state.newsfeedData.length == 0) {
      this.loadNewsfeedData(this.state.newsfeed,0,5);
    }
  }
  componentWillMount(){
    this.loadTheChallenges();
  }
  handleDataUpdate(context,data,i){
    return function(newData){
        console.log("xnxx");
        console.log(newData);
        data[i] = newData;
        context.setState({newsfeedData:data});
      };
  }
  handleNewsfeedData(newsfeedData){
    if(this.state.isLoadingNewsfeed){
      return (  <ActivityIndicator
                 animating={true}
                 color="#e7e7e7"
                 size="large"
                 style={{alignSelf:'center',paddingVertical:height*3/10}}
               />);
    }else if (!Array.isArray(newsfeedData) || newsfeedData.length==0) {
      return(
        <Text style={{fontSize:height/25,alignSelf:'center',marginTop:height/3,color:'#e7e7e7'}}>Icerik Yok!</Text>
      );
    }else{
      var rows = [];

      for(var i = 0;i<newsfeedData.length;i++){
        if(newsfeedData[i].type == "Campaign"){
          rows.push(
            <View style={{margin:height/100}} key={newsfeedData[i]._id}>
              <ButtonThing data={newsfeedData[i]}
                          navigator={this.props.navigator}
                          handleDataUpdate={this.handleDataUpdate.call(this,newsfeedData,i)}/>
            </View>
          );
        }else{
          rows.push(
            <View style={{margin:height/100}} key={newsfeedData[i]._id}>
              <ButtonThingForNews data={newsfeedData[i]}
                          navigator={this.props.navigator}/>
            </View>
          );
        }
      }
      if(!this.state.isLoadingMoreNewsfeed && this.state.newsfeed.length>newsfeedData.length){
        rows.push(<TouchableOpacity key={newsfeedData.length} onPress={()=>this.loadNewsfeedData(this.state.newsfeed,newsfeedData.length,newsfeedData.length+5)} style={{
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
        if(this.state.isLoadingMoreNewsfeed){
          rows.push(<ActivityIndicator
                    key={newsfeedData.length+1}
                     animating={true}
                     color="#e7e7e7"
                     size="large"
                     style={{alignSelf:'center',paddingVertical:height*0.001}}
                   />);
        }
      return rows;
    }
  }
  handleResponse(response){
    let isLoading = this.state.isLoading;
    if(response != undefined){
      if (response.length==0) {
        return(
          <Text style={{fontSize:height/25,alignSelf:'center',marginTop:height/3,color:'#e7e7e7'}}>Icerik Yok!</Text>
        );
      }else{
      var rows = [];
      for(var i = 0;i<response.length;i++){
        console.log("followed " + response[i].followed);
        var json={};
        if(response[i].challengeId!=undefined){
          console.log("^333333333333333333333");
          console.log(response[i].shortDescription);
          json._id=response[i].challengeId;
          json.name=response[i].name;
          json.shortDescription=response[i].shortDescription;
          json.coverPicture=response[i].coverPicture;
        }else{
          json._id=response[i]._id;
          json.name=response[i].name;
          json.shortDescription=response[i].shortDescription;
          json.coverPicture=response[i].coverPicture;
        }

        rows.push(
          <View style={{margin:height/100}} key={key++}>
            <ButtonThing data={json}
                        navigator={this.props.navigator}
                        handleDataUpdate={this.handleDataUpdate.call(this,response,i)}/>
          </View>
        );
      }
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

  loadNewsfeed(){
    if(!this.state.newsfeed && !this.state.isLoadingNewsfeed){
      this.setState({isLoadingNewsfeed:true});
    }else{
      this.setState({isRefreshingNewsfeed:true});
    }
    var context = this;
    Fetch('getNewsfeed','POST',null,null,function(response){
      console.log("What The Fuck1!" + response);
      if(!response){
        //Connection Error
        context.setState({error:true,errorPage:0});
      }else if (response == 9) {
        //Database Error
        context.setState({error:true,errorPage:0});
      }else{
        var noChange = true;
        if(context.state.isRefreshingNewsfeed){
          for(var i=0;i<5;i++){
            if(context.state.newsfeed[i]!=response[i]){
              noChange=false;
              break;
            }
          }
        }
        if(context.state.isRefreshingNewsfeed && noChange){
          console.log("no change!");
          context.setState({isRefreshingNewsfeed:false});
        }else{
          context.setState({newsfeed:response});
          context.loadNewsfeedData(response,0,5);
        }
      }
    });
  }
  loadNewsfeedData(newsfeed,lowerLimit,upperLimit){
    if(!this.state.newsfeedData && !this.state.isLoadingNewsfeed && lowerLimit==0){
      this.setState({isLoadingNewsfeed:true});
    }else if (!this.state.isLoadingMoreNewsfeed && lowerLimit>0) {
      this.setState({isLoadingMoreNewsfeed:true});
    }else if(!this.state.isRefreshingNewsfeed){
      this.setState({isRefreshingNewsfeed:true});
    }
    if(upperLimit>newsfeed.length){
      upperLimit=newsfeed.length;
    }
    var context = this;
    var json = {
      newsfeed:newsfeed.slice(lowerLimit,upperLimit)
    }
    Fetch('getNewsfeedData','POST',json,null,function(response){
      console.log("What The Fuck!" + response);
      if(!response){
        //Connection Error
        context.setState({error:true,errorPage:0});
      }else if (response == 9) {
        //Database Error
        context.setState({error:true,errorPage:0});
      }else{
        console.log(response);
        context.setState({newsfeedData:context.state.newsfeedData.length>lowerLimit&&!this.state.isRefreshingNewsfeed?response:context.state.newsfeedData.concat(response),isLoadingNewsfeed:false,isLoadingMoreNewsfeed:false,isRefreshingNewsfeed:false,scrollTo:true});
      }
    });
  }
 openControlPanel = () => {
   this._drawer.open()
 };
 closeSearchBarFactory(closeSearchBar){
   this.closeSearchBar = closeSearchBar;
 }
 //loads the challenges for my challenges page
 loadTheChallenges(){
   var context=this;
   var json={};
   Fetch('getChallenges','POST',{},null,function(response){
     if(response==null||response==undefined){
       console.log("no answer bro");
     }else{
       console.log(response.length);
       context.setState({
         response:response
       })
     }
   })
 }
getNotes(date){
  date=date.substring(0,10);

  console.log("^'!+!'+!'+!'+!'+'"+date);
  var context=this;
  var notee=NetworkCon.getNotes(date);
  context.setState({

    note:notee,

  });
}
sendNotes(note,date){
  var json={};
  json.notes=note;

  json.date=date.substring(0,10);

  NetworkCon.sendNotes(json);
}
  render() {
    console.log(this.state.isRefreshingNewsfeed);
    let context = this;
    NetworkCon.newMessageListener(function(){
      context.setState({refresh:true});
    });
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        tapToClose={true}

        type="static"
        content={
          <View>
          <View style={{backgroundColor:'#0097A7',height:height/3}} >
            <View style={{alignItems: 'center',top:height/18}}>
            <TouchableOpacity style={styles.avatar} onPress={this.navProfile.bind(this)}>
              <View style={{   borderRadius:20,
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
              {!this.props.invalidProfilePic
                ?
                <Image
                  onError={this.props.profilePicErrorHandler}
                  style={styles.avatar}
                  source={{uri:this.props.profilePic}}/>
                :
                 <Icon name="user-o" size={height/7} style={{color:'#e7e7e7'}} />
              }
              </View>
              <Text onPress={this.navProfile.bind(this)} style={styles.name} >{this.props.username}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{backgroundColor:'#e7e7e7',height:height*2/3}}>
          <View style={{alignItems:'center'}}>
            <TouchableOpacity onPress={this.navProfile.bind(this)}>
            <Text
              style={styles.item}>
              Profilim
            </Text>
          </TouchableOpacity>
            <TouchableOpacity onPress={this.navMessages.bind(this)} style={{flexDirection:'row'}}>
            <Text
              style={styles.item}>
              Mesajlar
            </Text>
            <View style={styles.noteView}>
            <Text style={styles.note} >{NetworkCon.getTotalNumberOfMessages()}</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row'}}>
            <Text
              style={styles.item}>
              Bildirimler
            </Text>
            <View style={styles.noteView}>
            <Text style={styles.note} >1</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.navSettings.bind(this)}>
            <Text style={styles.item}>
              Ayarlar
            </Text>
          </TouchableOpacity>
            <TouchableOpacity onPress={this.navImprovement.bind(this)}>
            <Text style={styles.item}>
              Gelişimim
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.item}>
             Hakkımızda
            </Text>
          </TouchableOpacity>
          </View>
          </View>
          </View>
        }
        acceptDoubleTap
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 50}}}
        onOpen={() => {
          console.log('onopen')
          this.setState({drawerOpen: true})
        }}
        onClose={() => {
          console.log('onclose')
          this.setState({drawerOpen: false})
        }}
        captureGestures={false}
        tweenDuration={500}
        openDrawerOffset={(viewport) => {
          return 100
        }}
        type="overlay"

        tweenHandler={(ratio) => ({
          main: { opacity:(2-ratio)/2 }
          })}>
          <Background height={height} width={width}/>
          <View style={{zIndex:1,height:this.state.drawerOpen?height:height/13}}>
          <NavBar onPressIcon={() =>this.openControlPanel()} navSearchResultFactory={this.navSearchResultFactory.bind(this)} notificationNumber={NetworkCon.getTotalNumberOfMessages()} height={height/13} width ={width}  justifyContent={true} color= "#e7e7e7" text = "ChallangeX" iconName="bars" search ={true} closeSearchBarFactory={this.closeSearchBarFactory.bind(this)}/>
          </View>
          <TouchableOpacity onPress={()=>{this.closeSearchBar()}}>
            {!this.state.error?
          <View style={{zIndex:0,top:height/100,height:height*12/13}}>
          <ScrollableTabView initialPage={this.state.errorPage} onChangeTab={(result)=>{/*pageNumber = result.i*/}} renderTabBar={() => <CustomTabBar underlineStyle={{backgroundColor:'#e7e7e7'}} />} tabBarTextStyle={{color:'#e7e7e7'}} >
             <ScrollView tabLabel=' Ana Sayfa ' ref={(scrollview)=>{mainScrollView=scrollview;}} onContentSizeChange={(contentWidth, contentHeight)=>{
               /*if(this.state.scrollTo){
                 mainScrollView.scrollTo({y: this.state.mainPageContentHeight*0.95});
                 this.setState({mainPageContentHeight:contentHeight,scrollTo:false});
               }*/
             }}
             refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoadingNewsfeed}
                  onRefresh={this.loadNewsfeed.bind(this)}
                  tintColor={"#e7e7e7"}
                /> }>
                  {this.handleNewsfeedData(this.state.newsfeedData)}
                  <View style={{height:height*0.05}}/>
             </ScrollView>
             <ScrollView tabLabel='Challangelarim'>
             <View style={{alignItems:'center'}} >
                   {this.handleResponse(this.state.response)}
                   <View style={{height:height*0.05}}/>
             </View>
           </ScrollView>
           <ScrollView tabLabel='   Takvim   ' style={styles.scrollViewStyle} >
             <View style={styles.container}>
                 <Calendar onLongPres={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}
                   ref="calendar"
                   eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
                   events={[{date: '2016-07-04', hasEventCircle: {backgroundColor: 'powderblue'}}]}
                   scrollEnabled
                   showControls
                   dayHeadings={customDayHeadings}
                   monthNames={customMonthNames}
                   titleFormat={'MMMM YYYY'}
                   prevButtonText={'Prev'}
                   nextButtonText={'Next'}
                   onDateSelect={(date) => this.setState({ selectedDate: date })}
                   onTouchPrev={(e) => console.log('onTouchPrev: ', e)}
                   onTouchNext={(e) => console.log('onTouchNext: ', e)}
                   onSwipePrev={(e) => console.log('onSwipePrev: ', e)}
                   onSwipeNext={(e) => console.log('onSwipeNext', e)}
                 />
                 <Text>Selected Date: {moment(this.state.selectedDate).format('MMMM DD YYYY')}</Text>


               </View>
               <TouchableWithoutFeedback onPress={() => {
            this.setModalVisible(!this.state.modalVisible);
            this.getNotes(this.state.selectedDate);
          }}>
                <View  style={styles.noteButton}>
                  <Text style={{color:'#e7e7e7',
                  fontWeight:'bold',
                  fontSize:width/20,
                textAlign:'center',marginTop:height/27}}>
                  Günün Notlarını Aç
                  </Text>
                </View>
               </TouchableWithoutFeedback>
               <Modal visible={this.state.modalVisible} onRequestClose={() => { this.setModalVisible(!this.state.modalVisible) }}>
                  <Background height={height} width={width}/>
                  <NavBar onPressIcon={()=>{this.setState({modalVisible:!this.state.modalVisible})}} right={width/2} height={height/13}  width ={width} color= "#e7e7e7" renderSubmit={true} text = "Ayarlar" iconName="arrow-left" search ={false}/>

                    <ScrollView style={{top:height/13,marginBottom:height/11}}>
                    <Text style={{color:'#e7e7e7',fontSize:width/20,fontWeight:'bold'}}>
                    {this.state.note?this.state.note:"sfsafdadsfasfsfd "}
                    </Text>
                    <TextInput    multiline={true}
                      style={{ fontSize:width/19, borderWidth: 0}}
                      onChangeText={(inputNote) => this.setState({inputNote})}
                      value={this.state.inputNote}
                    />
                    <Text style={{color:'#e7e7e7',fontSize:width/20,fontWeight:'bold'}}>
                  "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                    </Text>
                    <Text style={{color:'#e7e7e7',fontSize:width/20,fontWeight:'bold'}}>
                  "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                    </Text>

                  </ScrollView>
                  <View style={{height:height/6}} >
                    <TouchableWithoutFeedback onPress={()=>{console.log("sfaadsfsfsfdasfasf");this.sendNotes(this.state.inputNote,this.state.selectedDate);}}>
                     <View  style={styles.sendNoteButton}>
                       <Text style={{color:'#e7e7e7',
                       fontWeight:'bold',
                       fontSize:width/20,
                     textAlign:'center',marginTop:height/27}}>
                       Notları Kaydet
                       </Text>
                     </View>
                     </TouchableWithoutFeedback>

                    </View>
               </Modal>
             </ScrollView>

           </ScrollableTabView>
          <ActionButton buttonColor="#0097c7"  position="right"
          onPress={()=>{
            this.props.navigator.push({
                component: EventCreate
              })}}>
          </ActionButton>
        </View>
        :
        <ErrorJS errorTitle={"Baglanti Problemi!"}
                  errorText={"Internet Baglantisi Calismiyor\nLutfen baglantinizi kontrol edin"}
                    callback={()=>{
                      this.loadNewsfeed(this.state.errorPage);
                      this.setState({error:false});
                      }}/>
        }
          </TouchableOpacity>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  noteButton:{
    backgroundColor:'red',
    marginTop:height/20,
    alignSelf:'center',
    width:width/2,
    borderWidth:0,
    borderRadius:20,
    backgroundColor:'#0097f7',
    height:height/8,
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
  },
  sendNoteButton:{
    backgroundColor:'red',
    marginTop:height/70,
    alignSelf:'center',
    width:width*4/10,
    borderWidth:0,
    borderRadius:20,
    backgroundColor:'#0097f7',
    height:height/8,
    elevation:15,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f7f7f7',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  scrollViewStyle:{
    marginBottom:height/15
  },
  textStyle:{
    color:'#e7e7e7',
    fontWeight:'bold',
    fontSize:height/45
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  button:{
    backgroundColor:'#0097a7',
    width:width*99/300,
    height:height/18,
    borderColor:'#0097a7'
  },
  altBar:{
    height:height/16,
    width:width,
    left:0,
    top:height/13,
    position:'absolute',
    backgroundColor:'#0097a7'
  },
  attended2:{
    backgroundColor:'#e7e7e7',
    height:(height/5),
    width:width*48/50,
    borderColor:'#007bc7'
  },
  drawer: {
     shadowColor: '#000000',
     shadowOpacity: 0.8,
      shadowRadius: 3
    },
  attended3:{
    backgroundColor:'red',
    height:(height/5),
    width:width*48/50,
    borderColor:'#007bc7',
    marginTop:-5
  },
  attended:{
    backgroundColor:'blue',
    height:(height/5),
    width:width*48/50,
    borderColor:'#007bc7'
  },
  avatar: {
    width: height*1/6,
    height: height*1/6,
    borderRadius: 10,
  },
  name: {
    marginTop:10,
    fontSize:width/15,
    width:height*1/6,
    textAlign:'center',
    color:'#e7e7e7'
  },
  item: {
    fontSize: width/16,
    fontWeight: '400',
    marginTop: height/60,
    color:'#0097a7'
  },
  note:{
    fontSize: width/35,
    textAlign:'center',
    color:'#e7e7e7'
  },
  noteView:{
    marginTop:height/60,
    top:5,
    marginLeft:5,
    height : width/20,
    width: width/14,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#0097c7',
    borderRadius:5,
  },
});

module.exports = MainPageScene;
