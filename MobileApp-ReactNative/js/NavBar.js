
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  Platform,
  TextInput,
  ActivityIndicator,
  ScrollView
} from 'react-native';
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;
//import SearchBar from 'react-native-searchbar'
//import icon package
import Icon from 'react-native-vector-icons/FontAwesome';
class NavBar extends Component{
  constructor(props){
    super(props);
    this.state={searchBarOpen:false,searchText:"",searching:false,searchData:null};
  }
  showSearchBar() {
    this.setState({
      searchBarOpen: true,
    });
  }
  closeSearchBar(){
    this.setState({
      searchBarOpen: false,
    });
  }
  search(text){
    var json = {};
    json.searchFor = text;
    var context = this;
    Fetch('search','POST',json,null,function(response){
      if(response != undefined && response.length != undefined && response.length != 0){
        //Success
        console.log("process succeed!");
        //console.log(response[0]);
        console.log(response);
        context.setState({searching:false,searchData:response});
      }else{
        console.log("process failed!");
      }
    });
  }
  renderSearchButton(){
    if (this.props.search) {
      this.props.closeSearchBarFactory(this.closeSearchBar.bind(this));
      return (
          <TouchableOpacity  style={styles.searchIconStyle}
        onPress={() => this.showSearchBar()}>
            <Icon name="search" size={height/23}
              style={{ color:this.props.color}} />
          </TouchableOpacity>
      );
    }
  }
  renderSearchData(data,isLoading){
    console.log(data);
    if(data != undefined && data != null){
      if (data.length==0) {
        return(
          <Text style={{fontSize:height/25,alignSelf:'center',marginTop:height/3,color:'#e7e7e7'}}>Icerik Yok!</Text>
        );
      }else{
      var rows = [];
      var key = 0;
      for(var i = 0;i<data.length;i++){
        let navSearchResult = this.props.navSearchResultFactory(data[i].type,data[i]._id,data[i].description,data[i]);
        rows.push(
          <TouchableOpacity style={{height:height/11,width:width*5/7,margin:4}} onPress={navSearchResult} key={key++}>
          <View style={{flexDirection:'row',height:height/11,width:width*5/7}}>
            {data[i].photo?
              <Image style={{height:height/11,width:width/7}} source={{uri:NetworkCon.DOMAIN+data[i].photo}}/>
              :
              <View style={{height:height/11,width:width/7,backgroundColor:'#0097a7',alignItems:'center',justifyContent:'center'}}>
              {data[i].type == 'user'?
                <Icon name="user-o" size={height/15} style={{color:'#e7e7e7'}} />
                :
                <Icon name="bullseye" size={height/13} style={{color:'#e7e7e7'}} />
              }
              </View>
            }
            <View style={{height:height/11,width:width*4/7,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'#0097a7'}}>{data[i].description}</Text>
            </View>
          </View>
          </TouchableOpacity>
        );
        rows.push(
          <View style={{height:0.7,width:width*5/7,backgroundColor:'#0097a7'}} key={key++}></View>
        );
      }
      return rows;
    }
  }else{
    return (  <ActivityIndicator
               animating={isLoading}
               color="#0097a7"
               size="large"
               style={{alignSelf:'center',marginTop:height/7}}
             />);
  }
  }
  renderNotificationNumber(notificationNumber){
      if(notificationNumber!=undefined && notificationNumber!=null && notificationNumber != 0 && notificationNumber<100){
        return(
          <View style={{width:15,height:15,borderRadius:3,backgroundColor:'#C62828',alignItems:'center',justifyContent:'center',right:height/70}}>
            <Text style={{fontSize:10,color:'#e7e7e7'}}>{notificationNumber}</Text>
          </View>
        );
      }else if (notificationNumber>99) {
        return(
        <View style={{width:15,height:15,borderRadius:3,backgroundColor:'#C62828',alignItems:'center',justifyContent:'center',right:height/70}}>
          <Text style={{fontSize:10,color:'#e7e7e7'}}>∞</Text>
        </View>
        );
      }else{
        return(
          <View></View>
        );
      }
  }
  renderSettingsButton(){
    if (this.props.settings) {
      return (
          <TouchableOpacity style={styles.settingIconStyle}
        onPress={this.props.navSettings}>
            <Icon name="cog" size={height/21}
              style={{
                color:this.props.color}} />
          </TouchableOpacity>
      );
    }
  }

  renderNav(){
    if(!this.state.searchBarOpen){
      return (
        <View style ={{margin:4,
        marginTop:height/550,
        flexDirection: 'row',
        }}>
                  <TouchableOpacity onPress={this.props.onPressIcon} style={{marginLeft:width/40,    elevation:6,
                      shadowOffset:{width:1,height:3},
                      shadowColor:'#616161',
                      shadowRadius: 3,
                      shadowOpacity:1,
                      backgroundColor:'transparent'}}>
                    <View style={{flexDirection: 'row', width:height/16,height:height/16}}>
                    <Icon name={this.props.iconName} size={height/16} style={{color:this.props.color}}/>
                    {this.renderNotificationNumber(this.props.notificationNumber)}
                    </View>
                  </TouchableOpacity>
                    <Text style={{
                      color:this.props.color||'#e7e7e7',
                      fontSize:height/22,
                      marginLeft:width*0.01,
                      width:width*0.64,
                      height:height/16,
                      fontWeight:'bold'
                    }} onPress={this.props.onTextPress}>
                      {this.props.text}
                    </Text>

                  {this.renderSearchButton()}
                  {this.renderSettingsButton()}

        </View>
              );
    }else{
      return (
        <View style={{flexDirection:'column'}}>
        <View style={{
            backgroundColor:'#e7e7e7',
            marginTop:height/550,
            borderRadius:5,
            padding:5,
            left:10,
            width:width-20,
            height:height/15,
            flexDirection: 'row',
            justifyContent:'space-between',}}>
            <Button onPress={this.closeSearchBar.bind(this)} style={{marginLeft:width/40}}>
              <Icon name="arrow-left" size={height/20} style={{height:height/20,color:'#0097A7'}}/>
            </Button>
            <TextInput
              onChangeText={(searchText) => {this.setState({searchText:searchText,searching:true});this.search(searchText)}}
              value={this.state.searchText}
              style={{height:height/17,width:width*3/5,color:'#0097A7'}}
              autoFocus={true}/>
            <Button onPress={()=>{this.setState({searchText:"Searching for "+this.state.searchText})}} style={{height:height/20,marginLeft:width/40}}>
              <Icon name="search" size={height/20} style={{height:height/20,color:'#0097A7'}}/>
            </Button>
            </View>
            <View style={{
              backgroundColor:'#e7e7e7',
              width:width*5/7,
              height:height/3,
              alignSelf:'center',
              elevation:6,
              shadowOffset:{width:1,height:3},
              shadowColor:'#616161',
              shadowRadius: 3,
              shadowOpacity:1,}}>
                <ScrollView>
                  {this.renderSearchData(this.state.searchData,this.state.searching)}
                </ScrollView>
            </View>
            </View>
      )
    }
  }

  render() {
    return (
      <View style={{marginTop: (Platform.OS === 'ios') ? 20 : 0}}>
        <View style = {{
          height: this.props.height,
          width: this.props.width ,
          position: 'absolute',
          top:0,
          left:0,
          backgroundColor: '#0097A7',
        }}>
        {this.renderNav()}
        </View>
      </View>
    );
  }
}

class Button extends Component {
  handlePress(e) {
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}
        style={this.props.style}>
        <Text>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}



var styles = StyleSheet.create({
  /*Styles of bar1 and its children */

  searchIconStyle:{
    marginTop:5,
    position:'absolute',
    right:width*0.02,
    width:height/23,
    height:height/23,
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
    backgroundColor:'transparent'
  },
  settingIconStyle:{
    position:'absolute',
    right:width*0.02,
    marginTop:5,
    width:height/23,
    height:height/23,
    elevation:6,
    shadowOffset:{width:1,height:3},
    shadowColor:'#616161',
    shadowRadius: 3,
    shadowOpacity:1,
    backgroundColor:'transparent'
  },
});

module.exports = NavBar;
