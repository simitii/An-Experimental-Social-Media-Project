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
  ActivityIndicator,
} from 'react-native';
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var NavBar = require('./NavBar');
var Background = require('./Background');
var CustomTabBar = require('./CustomTabBar');
var NavBar = require('./NavBar');

import ScrollableTabView from 'react-native-scrollable-tab-view'

export default class SubChallange extends Component{

constructor(props){
  super(props);
  this.state=({

  })
}
goBack(){
  this.props.navigator.pop();
}
  render(){
    return(
      <View>
      <View style={{zIndex:1,height:height/13}}>
      <NavBar onPressIcon={()=> this.goBack()} right={width/2} height={height/13}  width ={width} color= "#e7e7e7" renderSubmit={true} text = "Ayarlar" iconName="arrow-left" search ={false}/>
      </View>
      <View style={{zIndex:0,height:height*12/13}}>

        <Background width={width} height={height}/>
        <ScrollableTabView initialPage={this.state.errorPage}  renderTabBar={() => <CustomTabBar underlineStyle={{backgroundColor:'#e7e7e7'}} />} tabBarTextStyle={{color:'#e7e7e7'}} >
           <ScrollView tabLabel='Tanım' style={styles.scrollViewStyle}>
           <Text style={styles.definitionStyle}>
             {this.props.definition||"asfsafsf"}
           </Text>
           </ScrollView>
           <ScrollView tabLabel='Notlarım'  style={styles.scrollViewStyle}>
           <View style={{alignItems:'center'}} >
           </View>
         </ScrollView>

         </ScrollableTabView>
         </View>

      </View>
    );
  }
}
const styles=StyleSheet.create({
  scrollViewStyle:{
    marginBottom:height/15,
  },
  definitionStyle:{
    color:'#e7e7e7',
    fontSize:width/16,
    fontWeight:'bold',
    textAlign:'center'
  }
});
module.exports=SubChallange;
