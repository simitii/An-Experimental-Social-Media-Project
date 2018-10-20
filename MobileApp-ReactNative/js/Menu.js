import React, { Component } from 'react'
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
} from 'react-native'
const window = Dimensions.get('window');
let width = window.width;
  const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';
let height = window.height;
export default class Menu extends Component {
  render() {

    return (
      <View  >
          <View style={{backgroundColor:'#0097A7',height:height/3,width:width}} >
            <View style={{alignItems: 'center',right:width*11/60,top:height/18}}>
              <Image
                style={styles.avatar}
                source={{uri}}/>
              <Text style={styles.name} >Kaan Dura</Text>
            </View>
          </View>
          <View style={{backgroundColor:'#e7e7e7',height:height*2/3}}>
            <View style={{alignItems:'center'}}>
              <Text
                onPress={this.props.onMyProfilePress}
                style={styles.item}>
                Profilim
              </Text>
              <Text
                onPress={this.props.onContactsPress}
                style={styles.item}>
                Contacts
              </Text>
              <Text
                onPress={this.props.onAyarlarPress}
                style={styles.item}>
                Ayarlar
              </Text>
            </View>
          </View>
      </View>
    );
  }
};
const styles = StyleSheet.create({

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  name: {
    marginTop:10,
    fontSize:width/15,
    color:'#e7e7e7'
  },
  item: {
    fontSize: width/18,
    fontWeight: '300',
    paddingTop: 5,
    color:'#0097a7'
  },
});
module.exports=Menu;
