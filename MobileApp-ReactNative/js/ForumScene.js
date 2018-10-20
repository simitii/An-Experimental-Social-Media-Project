
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome';
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
const onButtonPress = () => {
  Alert.alert('Button has been pressed!');
};
var MainPageScene=require('./MainPageScene');
var EventScene=require('./EventScene');
var LoginScene=require('./loginScene');
var Fetch = require('./Fetch');
var Background = require('./Background');
export default class ForumScene extends Component{
  constructor(props){
    super(props);
    this.state = {
        isLoading: true,
        info: undefined
    }
  }
  componentDidMount(){
    this.loadTheContent();
  }
  loadTheContent(){
    let context = this;
    var json = {
      _id: this.props.info._id
    };
    Fetch('getCampaignComments','POST',json,function(response){
      if(response != undefined && response.length != undefined && response.length != 0){
        //Success
        console.log("process succeed!");
        console.log(response[0]);
        context.setState({isLoading:false,info:response[0]});
      }else{
        console.log("process failed!");
      }
    });
  }
  navEvent(){
    this.props.navigator.pop();
  }
  render(){  return(
      <View style={styles.container}>
        <View>
          <Background height={height} width={width}/>
          <View style={styles.navBar}>
            <View style={{marginLeft:width/25,marginRight:width/500,flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{marginTop:height/68}}>
                <TouchableHighlight
                   onPress={this.navEvent.bind(this)}
                  style={{width:height/18}}
                  >
                  <Icon name="arrow-left" color="#e7e7e7" size={height/18}/>
                </TouchableHighlight>
              </View>
              <View style={{marginTop:height/70,marginRight:height/10}} >
                    <Text style={{fontSize:height/24,color:'#e7e7e7'}}>
                    {this.props.info.name}
                    </Text>
              </View>
            </View>
          </View>
        </View>
        <ScrollView style={{marginTop:height/11}}>
          <View >
            <Image source={require('../images/leyla.jpg')}
             style={{width:width,height:height/3}}>
             <View style={{marginTop:height*28/100}}>
              <View style={{justifyContent:'center'}}>
               <Text style={{fontWeight:'bold',fontSize:height/25,color:'black'}}>
               Durum:Devam Ediyor
               </Text>
               </View>
              </View>
             </Image>
          </View>
        <View style={{top:12}}>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
          <View>
            <Button style={styles.button}>
            </Button>
          </View>
        </View>
        </ScrollView>
      </View>

    );
  }
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    height: height,
    width: width,
    position: 'absolute',
    top:0,
    left:0
  },
  container: {
    flex: 1,
  },
  navBar:{
    height: height/11,
    width: width ,
    position: 'absolute',
    top:0,
    left:0,
    backgroundColor: '#0097a7',
    justifyContent:'space-between'
  },
  button:{
    width:width*48/50,
    marginLeft:width/50,
    marginRight:width/50,
    backgroundColor:'#e7e7e7',
    height:height/8,
    marginTop:-5
  }
});

module.exports=ForumScene;
