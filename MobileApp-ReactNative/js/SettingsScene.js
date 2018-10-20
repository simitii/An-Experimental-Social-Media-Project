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
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import { Switch } from 'react-native-switch';
import Button from 'apsl-react-native-button'
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var NavBar = require('./NavBar');
var Background = require('./Background');
var SettingThing=require('./SettingThing');

var Error=require('./Error');
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;
export default class SettingsScene extends Component{

  constructor(props) {
   super(props);
   this.state = {username:'',
   modalVisible:false,
   password:'',
   passwordToCheck:'',
   password2:'',
   passwordToSubmit2:'',
   passwordToSubmit:'',
   email:'',
   emailToCheck:'',
   isLoading:true,
   wait:true,
   reputation:'',
   reputationToCheck:'',
    text: 'Useless Placeholder' ,
    error:true};
 }
 goBack(){
   this.props.navigator.pop();
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
        this.addImageIntoDescription(source,response.width,response.height);
        /*
        this.setState({
          avatarSource: source
        });*/
      }
    });
  }
//gets the settings
  getSettings(){
    var context = this;
    Fetch('getUser','POST',{},null,function(response){
      console.log('fassdf2');
      context.setState({wait:false});
if(response=="9"||response==undefined){

  context.setState({error:true});

}else{
  console.log('fassdf222111');
  console.log(response);
  context.setState({
    error:false,
    username:response.username,
    password:response.password,
    passwordToCheck:response.password,
    password2:response.password,
    email:response.email,
    emailToCheck:response.email,
    reputationToCheck:response.reputation,
    reputation:response.reputation,
    passwordToSubmit:response.password
  })

}

    })

  }

  sendSettings(){
    var username=this.state.username;
    var password=this.state.password;
    var reputation=this.state.reputation;
    var email=this.state.email;
    var json={
      "reputation":reputation,
      "password":password,
      "username":username,
      "email":email,
    }
    Fetch('editUser','POST',json,null,null);
  }
  componentDidMount(){
    console.log("ALLAHK");
    this.getSettings();
    console.log("A22323AHK");
  }
  _setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  renderSubmit(){
  if(this.state.password==this.state.password2){
    console.log("yutube");
    this.setState({modalVisible:true});
    console.log("yutube2");
    console.log(this.state.passwordToSubmit);
      console.log(this.state.passwordToSubmit2);
if(this.state.passwordToSubmit2==this.state.passwordToSubmit){
console.log("completed");
    this.sendSettings();
    console.log("completed22");
}

  }else{
   Alert.alert(
            'Şifreler Uyuşmuyor',
            '',
            [

              {text: 'Tamam', onPress:() => console.log('Cancel Pressed!')},
            ]
          )}
  }
 exitButton(){
   if(this.state.reputationToCheck==this.state.reputation&&this.state.passwordToCheck==this.state.password&&this.state.email==this.state.emailToCheck){
    return(()=> this.goBack());
  }else{
    return(
      () => Alert.alert(
              'Emin Misiniz?',
              'Onaylamadan çıkarsanız değişiklikler kaydedilmez.',
              [
                {text: 'Çık', onPress:()=> this.goBack() },
                {text: 'Onayla', onPress:() => console.log('Cancel Pressed!')},
              ]
            )
    );

   }
 }
  render() {
    //returns the total view
    return (
      <KeyboardAvoidingView behavior={'position'} style={{height:height,width:width}} keyboardVerticalOffset={-4}>

      <View>

        <Background height={height} width={width}/>
        <View style={{flexDirection:'row'}}>
        <NavBar onPressIcon={this.exitButton()} right={width/2} height={height/13}  width ={width} color= "#e7e7e7" renderSubmit={true} text = "Ayarlar" iconName="arrow-left" search ={false}/>
        <Button onPress={this.renderSubmit.bind(this)} style={{width:width*29/100,backgroundColor:'#0097a7',marginLeft:width*68/100,height:height/14,borderRadius:15,borderWidth:0}} textStyle={{fontWeight:'bold',fontSize:width/16,color:'#e7e7e7'}}>
        Onayla
        </Button>
        </View>
        <ScrollView style={{marginTop:height/60}}>
          <Text style={{fontSize:width/18,color:'#e7e7e7',textAlign:'center'}}>
          Ayarları yapmak daha iyi iletişim sağlar.
          </Text>{this.state.wait?<ActivityIndicator
           animating={this.state.isLoading}
           color="#e7e7e7"
           size="large"
           style={{alignSelf:'center',paddingVertical:height*2/5}}
         />:<View/>}
{this.state.error?<Error width={width}  height={height} errorText={"İnternete Bağlanılamadı"} callback={this.getSettings()} />:
<View style={{alignSelf:'center'}}>

<TouchableWithoutFeedback onPress={this.selectPhotoTapped.bind(this)} >
   <Image source={require('../images/112081.jpg')}
   style={styles.image} />
</TouchableWithoutFeedback>

  <Text style={{textAlign:'left',fontSize:width/15,color:'#e7e7e7',fontWeight:'bold',marginTop:height/60,marginLeft:width/40}}>Hesap Ayarları</Text>
  <SettingThing label="Kullanıcı Adı"  onChangeText={(username) => this.setState({username})}  value={this.state.username}/>
  <SettingThing label="E-mail" onChangeText={(email) => this.setState({email})}  value={this.state.email}/>
  <SettingThing label="Şifre" secureTextEntry={true} onChangeText={(password) => this.setState({password})}  value={this.state.password}/>
  <SettingThing label="Şifre Onay" secureTextEntry={true} onChangeText={(password2) => this.setState({password2})}  value={this.state.password2}/>
  <SettingThing label="Lakap" maxLength={55} onChangeText={(reputation) => this.setState({reputation})}  defaultValue={this.state.reputation}/>
</View>}





      </ScrollView>
      <Modal  onRequestClose={() => this._setModalVisible(false)} visible={this.state.modalVisible}>

      <Background height={height} width={width}/>
      <View style={{paddingVertical:height/3}}>

        <SettingThing label="Şifre" secureTextEntry={true} onChangeText={(passwordToSubmit2) => this.setState({passwordToSubmit2})}  value={this.state.passwordToSubmit2}/>
        <Button onPress={() => this._setModalVisible(false)} style={{backgroundColor:'#0097f7',width:width/4,height:height/12,borderRadius:15,borderWidth:0,marginLeft:width*3/8,marginTop:height/20}}>
        Onayla
        </Button>
      </View>
      </Modal>

</View>
</KeyboardAvoidingView >

    );
  }
}

var styles = StyleSheet.create({
  image:{
   borderRadius:20,
   borderWidth:0.7,
   borderColor:'#007bc7',
   height:height*1/6,
   width:height*1/6,
   alignSelf:'center',
   marginTop:height/60
 }

});

module.exports = SettingsScene;
