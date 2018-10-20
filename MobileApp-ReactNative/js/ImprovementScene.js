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
  TouchableWithoutFeedback
} from 'react-native';
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
var NavBar = require('./NavBar');
var Background = require('./Background');
var ButtonThing2=require('./ButtonThing2');
var NetworkCon = require('./NetworkCon');
var Fetch = NetworkCon.fetch;
var EventScene=require('./EventScene');

var key=0;
export default class ImprovementScene extends Component{
  constructor(props){
    super(props);
    this.state=({
      asf:"",
      response:[]
    });
  }
  goBack(){
    this.props.navigator.pop();
  }
  dayCalculator(d,m,y,d2,m2,y2){
    // The number of milliseconds in one day
  var ONE_DAY = 1000 * 60 * 60 * 24;

  // Convert both dates to milliseconds
  var date1_ms = new Date(y2,m2-1,d2);
  console.log("PPPPPPPPPPPP"+date1_ms);
  var date2_ms = new Date(y,m-1,d);
  console.log("PPPPPPPPPPPP2222222"+date2_ms);

  // Calculate the difference in milliseconds
  var difference_ms = Math.abs(date1_ms - date2_ms)

  // Convert back to days and return
  return Math.round(difference_ms/ONE_DAY)
  }
  getImprovements(){
    var context=this;
    Fetch('getOldChallenges','POST',{},null,function(response){
      if(response==null){
        console.log("no answer bro");
      }else{
        console.log(response.length);
        context.setState({
          response:response
        })
      }

    })
  }

  componentWillMount(){
    this.getImprovements();
  }
  handleResponse(response){
    var response=this.state.response;
    if(response.length==0||response==""){
      console.log("ALLAHHH")
      return(
        <Text style={{fontSize:width/12,color:'#e7e7e7',fontWeight:'bold',textAlign:'center',marginTop:height/22}}>
        Challenge geçmişi bulunmuyor
        </Text>
      );
    }else{
      var rows=[];
      for(var i=0;i<response.length;i++){
        var starter=response[i].startDate;
        var finisher=response[i].finishDate;
       var start=starter.split('/');
       var finish=finisher.split('/');
       var json={};
       json.days=this.dayCalculator(start[0],start[1],start[2],finish[0],finish[1],finish[2]);
       json.name=response[i].name;
       json.startDate=response[i].startDate;
       json.finishDate=response[i].finishDate;
       json._id=response[i].challengeId;
        rows.push(
          <ButtonThing2 key={key++}                      navigator={this.props.navigator}

          data={json} />
        );
      }
      return rows;
    }

  }
    render(){
      console.log(this.state.response);
      return(

<View style={{flex:1}}>

          <Background height={height} width={width}/>
            <NavBar onPressIcon={()=> this.goBack()}   justifyContent={true} height={height/11} width ={width} color= "#e7e7e7"  text = "Gelişimim" iconName="arrow-left" search ={false} settings={false}/>
<View style={{alignItems:'center',marginTop:height/13}}>
{this.handleResponse(this.state.response)}
        </View>
    </View>
      );
    }
  }


module.exports=ImprovementScene;
