var Fetch = require('./NetworkCon').fetch;
import Share, {ShareSheet, Button} from 'react-native-share';

exports.follow = function(what,_id){
  var context = this;
  return function(){
    var json = {};
    json._id = _id;
    if(context.state.notificationButton){
      Fetch('unfollow'+ what,'POST',json,null,function(response){
       if(response != undefined && (response == "1" || response == "16")){
         //Success
         console.log("process succeed!");
         if(context.props.data){
           var newData = context.props.data || {};
           newData.followed = false;
           newData.numberOfFollowers--;
           context.props.handleDataUpdate(newData);
         }else if (context.props.info.data) {
           var newData = context.props.info.data || {};
           newData.followed = false;
           newData.numberOfFollowers--;
           context.props.info.handleDataUpdate(newData);
         }
       }else{
         console.log("process failed!");
         console.log(response);
         if(context.state.numberOfFollowers!=undefined){
           context.setState({notificationButton:true,numberOfFollowers:context.state.numberOfFollowers+1});
         }else{
           context.setState({notificationButton:true});
         }
       }
     });
     if(context.state.numberOfFollowers!=undefined){
       context.setState({notificationButton:false,numberOfFollowers:context.state.numberOfFollowers-1});
     }else{
       context.setState({notificationButton:false});
     }
   }else{
     Fetch('follow' + what,'POST',json,null,function(response){
      if(response != undefined && (response == "1" || response == "16")){
        //Success
        console.log("process succeed!");
        if(context.props.data){
          var newData = context.props.data || {};
          newData.followed = true;
          newData.numberOfFollowers++;
          context.props.handleDataUpdate(newData);
      }else if(context.props.info.data) {
          var newData = context.props.info.data || {};
          newData.followed = true;
          newData.numberOfFollowers++;
          context.props.info.handleDataUpdate(newData);
      }
      }else{
        console.log("process failed!");
        if(context.state.numberOfFollowers!=undefined){
          context.setState({notificationButton:false,numberOfFollowers:context.state.numberOfFollowers-1});
        }else{
          context.setState({notificationButton:false});
        }
      }
    });
    if(context.state.numberOfFollowers!=undefined){
      console.log("xxxnx");
      context.setState({notificationButton:true,numberOfFollowers:context.state.numberOfFollowers+1});
    }else{
      context.setState({notificationButton:true});
    }
   }
 }
}

exports.up = function(what,_id){
  var context = this;
  return function(){
    var json = {};
    json._id = _id;
    if(context.state.upButton){
      Fetch('unlike' + what,'POST',json,null,function(response){
       if(response != undefined && (response == "1" || response == "16")){
         //Success
         console.log("process succeed!");
         if(context.props.data){
           var newData = context.props.data || {};
           newData.liked = false;
           newData.numberOfPeopleLiked--;
           context.props.handleDataUpdate(newData);
         }else if (context.props.info.data) {
           var newData = context.props.info.data || {};
           newData.liked = false;
           newData.numberOfPeopleLiked--;
           context.props.info.handleDataUpdate(newData);
         }
       }else{
         console.log("process failed!");
         if(context.state.numberOfPeopleLiked!=undefined){
           context.setState({upButton:true,numberOfPeopleLiked:context.state.numberOfPeopleLiked+1});
         }else{
           context.setState({upButton:true});
         }
       }
     });
     if(context.state.numberOfPeopleLiked!=undefined){
       context.setState({upButton:false,numberOfPeopleLiked:context.state.numberOfPeopleLiked-1});
     }else{
       context.setState({upButton:false});
     }
   }else{
     Fetch('like'+what,'POST',json,null,function(response){
      if(response != undefined && (response == "1" || response == "16")){
        //Success
        console.log("process succeed!");
        if(context.props.data){
          var newData = context.props.data || {};
          newData.liked = true;
          newData.numberOfPeopleLiked++;
          context.props.handleDataUpdate(newData);
        }else if (context.props.info.data) {
          var newData = context.props.info.data || {};
          newData.liked = true;
          newData.numberOfPeopleLiked++;
          context.props.info.handleDataUpdate(newData);
        }
      }else{
        console.log("process failed!");
        if(context.state.numberOfPeopleLiked!=undefined){
          context.setState({upButton:false,numberOfPeopleLiked:context.state.numberOfPeopleLiked-1});
        }else{
          context.setState({upButton:false});
        }
      }
    });
      if(context.state.numberOfPeopleLiked!=undefined){
        context.setState({upButton:true,numberOfPeopleLiked:context.state.numberOfPeopleLiked+1});
      }else{
        context.setState({upButton:true});
      }
    }
  }
}

exports.share= function(shareOptions){
  Share.open(shareOptions).catch((err) => { err && console.log(err); });
}
