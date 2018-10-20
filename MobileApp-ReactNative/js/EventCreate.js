import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  Modal,
  Platform
} from 'react-native';
import KaanEffect from './KaanEffect'
import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker'
import Share, {ShareSheet} from 'react-native-share'
const window = Dimensions.get('window');
const width = window.width;
const height = window.height;

import ModalBox from 'react-native-simple-modal';

var Background = require('./Background');
var NavBar = require('./NavBar');
var Chat=require('./Chat');
var Editor=require('./Editor');
var Fetch = require('./NetworkCon').fetch;
import {pushNotification, scheduleNotification} from './Notification'
var CardNavigation=require('./CardNavigation');
export default class EventCreate extends Component{
  constructor(props){
    super(props);
    this.state={
      name:"",
      cover: null,
      visible: false,
      descriptionInfo:[{type:'text',content:"",height:20},],
      fontSize:20,
      imageadd:false,
      date:"2016-05-15",
      imageSource:null,
      text:"",
      isPrivate:false,
      modalVisible:false,
    };
  }
  setModalVisible(visible){
    this.setState({modalVisible: visible});
  }
  goBack(){
    this.props.navigator.pop();
  }
  sendCampaignData(){
    let descriptionInfo = this.state.descriptionInfo;
    var data = {
      'name':this.state.name,
      'shortDescription':this.state.text,
      'detailedDescription':[],
    }
    var files = {
      'des-pict':[],
    }
    if(this.state.imageSource){
      files.cover = {source: this.state.imageSource};
    }
    for(x in descriptionInfo){
      let a = {
        type: descriptionInfo[x].type,
      };
      if(a.type === 'text'){
        a.content = descriptionInfo[x].content;
        if(a.content.length > 0)
          data.detailedDescription.push(a);
      }else if(a.type === 'img'){
        a.source = descriptionInfo[x].source;
        files['des-pict'].push(a);
        data.detailedDescription.push({type:'img',});
      }
    }
    if(!files['cover'] && files['des-pict'].length == 0){
      files = null;
    }
    Fetch('createCampaign','POST',data,files,function(response){
      console.log("what the hell " + response);
    });
  }

  renderBagis(){
    if(this.state.bagis){
      return(
        <View style={{alignItems:'center'}}>
          <Text style={{color:'#e7e7e7',fontSize:width/16,fontWeight:'bold',marginTop:height/50,marginTop:height/13}}>Gerekli Miktar</Text>
<TextInput  placeholder="Miktar" keyboardType="numeric" style={{width:width*9/10,height:height/15,paddingTop:0,marginTop:height/20,color:'#e7e7e7',fontSize:width/16,fontWeight:'bold',paddingLeft:width/25,paddingRight:width/25}}/>

<Text style={{color:'#e7e7e7',fontSize:width/16,fontWeight:'bold',marginTop:height/50,marginTop:height/13}}>Bitiş Zamanı</Text>

<DatePicker
style={{width: width*24/50,backgroundColor:'#e7e7e7',marginTop:height/20}}
date={this.state.date}
mode="date"
placeholder="select date"
format="YYYY-MM-DD"
minDate="2016-05-01"
maxDate="2016-06-01"
confirmBtnText="Confirm"
cancelBtnText="Cancel"
customStyles={{
dateIcon: {
position: 'absolute',
left: 0,
top: 4,
marginLeft: 0
},
dateInput: {
marginLeft: 36
}
// ... You can check the source to find the other keys.
}}
onDateChange={(date) => {this.setState({date: date})}}
/>

    </View>
      );
    }
    else{
      return(
        <View style={{alignItems:'center'}}>
        <Text style={{color:'#e7e7e7',fontSize:width/16,fontWeight:'bold',marginTop:height/50,marginTop:height/13}}>Tarih</Text>

        <DatePicker
    style={{width: width*24/50,backgroundColor:'#e7e7e7'}}
    date={this.state.date}
    mode="date"
    placeholder="select date"
    format="YYYY-MM-DD"
    minDate="2016-05-01"
    maxDate="2016-06-01"
    confirmBtnText="Confirm"
    cancelBtnText="Cancel"
    customStyles={{
      dateIcon: {
        position: 'absolute',
        left: 0,
        top: 4,
        marginLeft: 0
      },
      dateInput: {
        marginLeft: 36
      }
      // ... You can check the source to find the other keys.
    }}
    onDateChange={(date) => {this.setState({date: date})}}
  />
<Text style={{color:'#e7e7e7',fontSize:width/16,fontWeight:'bold',marginTop:height/25}}>Zaman</Text>
  <DatePicker
            style={{width: width*24/50,backgroundColor:'#e7e7e7'}}
            date={this.state.time}
            mode="time"
            format="HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            minuteInterval={10}
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
              }}
            onDateChange={(time) => {this.setState({time: time});}}
          />
  </View>
      );
    }
  }
  selectPhotoTapped() {
  const options = {
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
      skipBackup: true
    }
  };

  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled photo picker');
    }
    else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    }
    else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }
    else {
      var source;

      // You can display the image using either:
      //source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

      //Or:
      if (Platform.OS === 'android') {
        source = {uri: response.uri, isStatic: true};
      } else {
        source = {uri: response.uri.replace('file://', ''), isStatic: true};
      }

      this.setState({
        imageSource: source
      });
    }
  });
}

  get cards () {
    console.log("image Source: " +this.state.imageSource);
    return [

        (
        <View>
        <Text style={{color:'#e7e7e7',fontWeight:'bold',textAlign:'center',marginTop:height*0.01,fontSize:height*0.025}}>Challange icin temel bilgileri girin.</Text>
        <View style={styles.container2}>
        { this.state.imageSource === null ? <Text  onPress={this.selectPhotoTapped.bind(this)} style={styles.imageText}>Bir fotoğraf seçin</Text> :
        <TouchableWithoutFeedback  onPress={this.selectPhotoTapped.bind(this)}>
       <Image style={styles.image} source={this.state.imageSource} />
       </TouchableWithoutFeedback>   }

 <TextInput onChangeText={(name) => this.setState({name})} placeholder="Kampanyanız için bir isim girin" style={{width:width*9/10,height:height/15,paddingTop:0,color:'#0097a7',fontSize:width/16,fontWeight:'bold',paddingLeft:width/25,paddingRight:width/25,alignSelf:'center'}}/>

         <TextInput onChangeText={(text) => this.setState({text})} placeholder="Kampanyanız için kısa bir özet girin.Bu, anasayfa ve diğer sayfalarda etkinliğin tanıtımı için çıkacak." multiline={true} style={{width:width*9/10,height:height*21/100,borderRadius:20,alignSelf:'center',color:'black',fontSize:width/18,paddingLeft:width/25,paddingRight:width/25}}/>
        </View>
      </View>
        ),
        (
        <View>
        <Editor context={this}/>
        </View>
        ),
        (
        <View>
          <Text style={{color:'#e7e7e7',fontWeight:'bold',textAlign:'center',margin:height*0.005,marginTop:height*0.01,fontSize:height*0.025}}>{"Tebrikler,mukemmel bir challange icin\nson bir adim kaldi."}</Text>
          <View style={{height:height*0.6,justifyContent:'center'}}>
          <Text style={{color:'#e7e7e7',fontWeight:'bold',textAlign:'center',margin:height*0.005,marginBottom:height*0.025,fontSize:height*0.025}}>{"Simdi, bu gorevin herkese acik mi yoksa kisisel bir gorev mi olduguna karar verin."}</Text>
          <TouchableOpacity onPress={()=>this.setState({isPrivate:false})} style={{
              padding:4,
              marginTop:height*0.01,
              width:width*70/100,
              height:height*0.05,
              alignSelf:'center',
              backgroundColor:'#e7e7e7',
              borderColor:'#e7e7e7',
              borderRadius:10,
              elevation:6,
              shadowOffset:{width:1,height:3},
              shadowColor:'#616161',
              shadowRadius: 3,
              shadowOpacity:1,
              alignItems:'center',
              justifyContent:'center',
              flexDirection:'row'}}>
            <Text style={{color:'#0097a7',fontWeight:'bold'}}>Herkese Acik</Text>
            {!this.state.isPrivate?
              <Icon name="check-square-o" size={width/13} style={{color:'#0097a7',position:'absolute',right:width*0.04,}}/>
              :
              <Icon name="square-o" size={width/13} style={{color:'#0097a7',position:'absolute',right:width*0.05,}}/>
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.setState({isPrivate:true})} style={{
              padding:4,
              marginTop:height*0.01,
              width:width*70/100,
              height:height*0.05,
              alignSelf:'center',
              backgroundColor:'#e7e7e7',
              borderColor:'#e7e7e7',
              borderRadius:10,
              elevation:6,
              shadowOffset:{width:1,height:3},
              shadowColor:'#616161',
              shadowRadius: 3,
              shadowOpacity:1,
              alignItems:'center',
              justifyContent:'center',
              flexDirection:'row'}}>
            <Text style={{color:'#0097a7',fontWeight:'bold'}}>Kisisel</Text>
            {this.state.isPrivate?
              <Icon name="check-square-o" size={width/13} style={{color:'#0097a7',position:'absolute',right:width*0.04,}}/>
              :
              <Icon name="square-o" size={width/13} style={{color:'#0097a7',position:'absolute',right:width*0.05,}}/>
            }
          </TouchableOpacity>
            <TouchableOpacity onPress={this.sendCampaignData.bind(this)} style={{
                padding:4,
                marginTop:height*0.05,
                width:width*82/100,
                height:height*0.056,
                alignSelf:'center',
                backgroundColor:'#e7e7e7',
                borderColor:'#e7e7e7',
                borderRadius:10,
                elevation:6,
                shadowOffset:{width:1,height:3},
                shadowColor:'#616161',
                shadowRadius: 3,
                shadowOpacity:1,
                alignItems:'center',
                justifyContent:'center'}}>
                <View style={{
                  padding:2,
                  width:width*80/100,
                  height:height*0.044,
                  alignSelf:'center',
                  backgroundColor:'#0097a7',
                  borderColor:'#e7e7e7',
                  borderRadius:10,
                  elevation:6,
                  shadowOffset:{width:1,height:3},
                  shadowColor:'#616161',
                  shadowRadius: 3,
                  shadowOpacity:1,
                  alignItems:'center',
                  justifyContent:'center',
                }}>
                  <Text style={{color:'#e7e7e7',fontWeight:'bold',fontSize:height*0.025}}>Bilgileri Kaydet ve Tamamla!</Text>
                </View>
            </TouchableOpacity>
          </View>
      </View>
        ),
    ];
}
  render(){
    return(
      <View style={styles.container}>
      <Background height={height} width={width} />
      <View style={{zIndex:1,height:height/13,backgroundColor:'#0097a7'}}>
      <NavBar onPressIcon={()=>this.setState({modalVisible:true})} justifyContent={false} height={height/13} width ={width} color= "#e7e7e7"  text = "Yeni Challange" iconName="close" EventScene={false} search ={false} settings={false}/>
      </View>
        <View style={{zIndex:0,top:height/50,height:height*12/13}}>
          <CardNavigation
              ref={'cardnavigation'}
              cards={this.cards}
              containerStyle={{height:height*12/13}}/>
        </View>
        <ModalBox overlayBackground={'transparent'}
          modalDidClose={() => this.setState({modalVisible: false})} offset={100} modalStyle={styles.modalStyle}   open={this.state.modalVisible}>
          <TouchableOpacity onPress={()=>this.setState({modalVisible:false})}
              style={[{position:'absolute',right:width*0.022,top:height*0.01,zIndex:1},styles.imageButtons]}>
              <Icon name="close" size={width/10} style={{color:'#e7e7e7'}} />
          </TouchableOpacity>
          <Text style={{textAlign:'center',color:'#e7e7e7',fontWeight:'bold',fontSize:height*0.033}}>DIKKAT</Text>
          <Text style={{textAlign:'center',color:'#e7e7e7',fontWeight:'bold',fontSize:height*0.022}}>{"Kapatirsaniz suana kadar girdiginiz bilgiler kaydedilmeyecektir."}</Text>
              <TouchableOpacity onPress={this.goBack.bind(this)} style={{padding:4,alignSelf:'center',width:width*0.60,borderWidth:0,borderRadius:10,height:height*0.05,backgroundColor:'#e7e7e7',justifyContent:'center',elevation:6,
                  shadowOffset:{width:1,height:3},
                  shadowColor:'#616161',
                  shadowRadius: 3,
                  shadowOpacity:1,
                  margin:height*0.01}}>
                <Text style={{textAlign:'center',color:'#0097a7',fontWeight:'400'}}>Tamamlamadan Kapat!</Text>
              </TouchableOpacity>
        </ModalBox>
      </View>
    );
  }
}

var styles=StyleSheet.create({
  TextInput:{
    marginTop:height/55,
    borderRadius:10,
    height:height/7
  },
  container:{
  flex:1,
  },
  text:{
    fontSize:width/25,
    color:'#212121',
height:height*21/100,
    textAlign:'center',
    margin:2
  },
  heading:{
    fontSize:width/15,
    fontWeight:'bold',

    height:height/17,
    color:'#0097a7',
    textAlign:'center'
  },
  container2:{
    padding:4,
    height:height*70/100,
    width:width*97/100,
    alignSelf:'center',
    backgroundColor:'#e7e7e7',
    borderColor:'#e7e7e7',
    borderRadius:10,
    marginTop:height/50,
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
  },
  image:{
height:height*35/100,
alignSelf:'center',

width:width*9/10,
borderRadius:20,
  },
  imageText:{
height:height*35/100,
alignSelf:'center',
textAlign:'center',
color:'#0097a7',
fontWeight:'bold',
fontSize:width/12,
paddingTop:height/8,
width:width*9/10,
borderRadius:20,
  },
  avatar:{
    height:300,
    width:width
  },
  modalStyle:{
    right:width*0.015,
    width:width*0.92,
    top:height*0.003,
    height:height*0.30,
    backgroundColor:'#0097a7',
    borderColor:'#e7e7e7',
    borderWidth:height*0.001,
    justifyContent:'center',
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
});
module.exports=EventCreate;
