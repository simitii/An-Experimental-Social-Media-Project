import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  ScrollView,
  Modal,
  Platform
} from 'react-native';
import ActionButton from 'react-native-action-button'
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import Iconn from 'react-native-vector-icons/Ionicons'
const window = Dimensions.get('window');
const width = window.width;
const height = window.height;
var Background = require('./Background');
var NavBar = require('./NavBar');
var mScrollView = null;
export default class Editor extends Component{
  constructor(props){
    super(props);
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
      }
    });
  }
  addImageIntoDescription(source,imageWidth,imageHeight){
    var info = {};
    info.type = 'img';
    info.source = source;
    let ratio = (width-16)/imageWidth;
    info.width = width-16;
    info.height = imageHeight*ratio;
    var array = this.props.context.state.descriptionInfo;
    array.push(info);
    array.push({type:'text',content:"",height:20});
    this.props.context.setState({
      descriptionInfo: array,
      imageadd:true,
    });
  }
  renderDescriotionInfo(descriptionInfo){
    var rows = [];
    for(var i = 0;i<descriptionInfo.length;i++){
      var info = descriptionInfo[i];
      if(info.type === 'img'){
        rows.push(<Image key={i} style={{margin:8,borderRadius:5,height:info.height,width:info.width}} source={info.source} />);
      }else{
        function textChange(key){
            return function(text){
                var info = this.props.context.state.descriptionInfo;
                info[key].content = text;
                this.props.context.setState({descriptionInfo:info});
            };
        }
        function contentSizeHandle(key){
            return function(event){
              var info = this.props.context.state.descriptionInfo;
              console.log(info[key].height);
              console.log("contentHeight" + event.nativeEvent.contentSize.height);
              if(event.nativeEvent.contentSize.height >= info[key].height){
              info[key].height = info[key].height + 18;
              this.props.context.setState({descriptionInfo:info});
            }else if(event.nativeEvent.contentSize.height+14 < info[key].height){
              info[key].height = info[key].height - 18;
              this.props.context.setState({descriptionInfo:info});
            }
            }
        }
        rows.push(<TextInput key={i} value={this.props.context.state.descriptionInfo[i].content} onChangeText={textChange(i).bind(this)} onContentSizeChange={contentSizeHandle(i).bind(this)} style={{color:'#e7e7e7',margin:8,height:this.props.context.state.descriptionInfo[i].height,width:width-16,fontSize:15}}  placeholder="Tıkla ve Yaz..." autoFocus={true} multiline={true}></TextInput>);
      }
    }
    return rows;
  }

  scrollToTheEnd(contentWidth, contentHeight){
    if(mScrollView !== null && this.props.context.state.imageadd && contentHeight>height){
      mScrollView.scrollTo({y: contentHeight-height*7/10});
      this.props.context.setState({imageadd:false});
    }
  }

  render(){
    return(
      <View style={{top:height*0.01,height:height*0.75}}>
        <Text style={{color:'#e7e7e7',fontWeight:'bold',textAlign:'center',fontSize:height*0.025}}>Challange icin detayli aciklama yazin.</Text>
        <ScrollView ref={(scrollView) => { mScrollView = scrollView; }} onContentSizeChange={this.scrollToTheEnd.bind(this)}>
          <View style={{flex:1}} >
          {this.renderDescriotionInfo(this.props.context.state.descriptionInfo)}
          </View>
        </ScrollView>
        <ActionButton buttonColor="#0097c7"  positin="right"
        onPress={this.selectPhotoTapped.bind(this)}>
        </ActionButton>

      </View>
    );
  }
}
var styles=StyleSheet.create({

});
module.exports=Editor;
