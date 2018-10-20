const Realm = require('realm');



let DOMAIN = 'https://challangeapp.appspot.com';
let API = DOMAIN + '/api/';
let PROFILEPICS = API + 'uploads/';


let onMessageCallback = null;

exports.DOMAIN = DOMAIN;
exports.API = API;
exports.PROFILEPICS = PROFILEPICS;

//Message & Notification Storage
const UserSchema ={
  name: 'User',
  properties:{
            _id: 'string',
            name: 'string',
            avatar: 'string',
  }
};
const MessageSchema = {
  name: 'Message',
  properties:{
            _id: 'string',
            text: 'string',
            createdAt: 'date',
            user: 'User',
            toWhom: 'User',
  }
};
const ChatSchema = {
  name: 'Chat',
  properties:{
            withUser: 'User',
            messages : {type: 'list', objectType: 'Message'},
            numberOfNewMessage: 'int',
  }
};

const CarSchema = {
 name: 'Car',
 properties: {
   make:  'string',
   model: 'string',
   miles: {type: 'int', default: 0},
 }
};

const NoteSchema={
 name:'Note',
 primaryKey:'date',
 properties:{
   date:'string',
   notes:'string'
 }
};
let realm = new Realm({
  schema: [UserSchema,CarSchema,NoteSchema,MessageSchema,ChatSchema]
});
exports.writer=function(){
  console.log("okey");
var car;
realm.write(() => {
  car = realm.create('Car', {
    make: 'Honda',
    model: 'fCivic',
    miles: 750,
});
});
// you can access and set all properties defined in your model

console.log("okey"+car.make);
};

exports.getter=function(){
 var carr=realm.objects('Car');
 return carr;
 console.log("allah;");
}
exports.sendNotes=function(json){
  var string='date = '+"\""+json.date+"\"";
  var result=realm.objects('Note').filtered(string);
  console.log("okeyPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"+string+json.notes+"   "+json.date+"TTTTTTTTTT"+result['0'].date);

  if(result['0'].date==undefined||result['0'].date==null){
    console.log("result.date==undefined||result.date==null)");
    realm.write(() => {
     realm.create('Note', {
       date: json.date,
       notes:json.notes

      });
    });
  }else{
    console.log("/!'^!'^!'^/!'^!''fffffffffff^!''");
    var str;
    if(result['0'].notes==undefined||result['0'].notes==null){
      str="";
    }else{
      str=result['0'].notes;
    }
    str=str+json.notes;
    realm.write(()=>{
      realm.create('Note',{
        date:json.date,
        notes:str
      },true)
    })
  }

}
exports.getNotes=function(noteDate){
  var string='date = '+"\""+noteDate+"\"";
  console.log(noteDate+"%%%%%%%%%%%55"+string);
  var result=realm.objects('Note').filtered(string);
  console.log(result['0']);
  if(result['0'].notes==undefined||result['0'].notes==null){
    console.log("11111111111111111111111111");
    return null;
  }else{
    console.log("22222222222222222222222222222222");
    return result['0'].notes;
  }

}
var getChat = function(userID){
  let chats = realm.objects('Chat');
  for(i in chats){
    if(chats[i].withUser._id == userID){
      return chats[i];
    }
  }
  return null;
}
exports.getChat = getChat;

var getChatsWithoutDetail = function(){
  let chats = realm.objects('Chat');
  return chats;
}
exports.getChatsWithoutDetail = getChatsWithoutDetail;

exports.makeZeroNewMessage = function(chat){
  realm.write(()=>{
    chat.numberOfNewMessage = 0;
  });
};
exports.getTotalNumberOfMessages = function(){
  let chats = realm.objects('Chat');
  let counter = 0;
  for(i in chats){
    counter += chats[i].numberOfNewMessage;
  }
  return counter;
}

var storeMessage = function(message,withWhom){
  let chat = getChat(withWhom._id);
  console.log(chat);
  message.createdAt = new Date();
  realm.write(()=>{
    if(chat === null){
      let numberOfNewMessage = 0;
      if(withWhom._id == message.user._id){
        numberOfNewMessage++;
      }
      realm.create('Chat', {withUser: withWhom, messages:[message],numberOfNewMessage:numberOfNewMessage});
    }else{
      if(withWhom._id == message.user._id){
        chat.numberOfNewMessage++
      }
      chat.messages.push(message);
    }
  });
};

exports.newMessageListener = function(callback){
  onMessageCallback = callback;
}
let login = false;

var socket = null;
exports.loginSucceed = function(){
  if(socket === null){
    socket = require('socket.io-client')(DOMAIN);
    socket.on('message',function(message){
      console.log(message);
      storeMessage(message,message.user);
      if(onMessageCallback !== null){
        onMessageCallback();
      }
    });
    socket.on('notification',function(notification){
      console.log(notification);
      newNotifications.push(notification);
    });
  }
};

exports.sendMessage = function(messages){
  if(socket!==null){
    for(i in messages){
      let message = messages[i];
      message.user.name = 'Samet';
      message.user.avatar = '';
      console.log(message);
      storeMessage(message,message.toWhom);
      socket.emit('message',message);
    }
  }
};


//API COMMUNICATION
exports.fetch = async function(path,method,json,files,callback){
  let gotResponse = false;
  if(files === null){
  // the case of there is No File
  try {
  let response = await fetch(API+path, {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: json?JSON.stringify(json):undefined,
    });
    let responseJSON = undefined;
    if (response !== undefined) {
      responseJSON = await response.json();
      gotResponse = true;
    }
    callback(responseJSON);
    }catch(error) {
      if(!gotResponse){
        // Handle error
        console.log(error);
        //Network Connection Problem
        callback(undefined);
      }
    }
  }else{
    let data = new FormData();
    for(key in json){
      let value = String(json[key]);
      if(typeof json[key] == 'object'){
        value = JSON.stringify(json[key]);
      }
      data.append(key,value);
    }
    for(key in files){
      if(files[key]){
        if(!Array.isArray(files[key])){
          data.append(key,{uri: files[key].source,name: 'file',type: 'multipart/form-data'});
        }else {
          for(i in files[key]){
            data.append(key,{uri: files[key][i].source,name: 'file',type: 'multipart/form-data'});
          }
        }
      }
    }
    try {
    let response = await fetch(API+path, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: data,
      });
      let responseJSON = undefined;
      if (response !== undefined) {
        responseJSON = await response.json();
        gotResponse = true;
      }
      console.log(responseJSON);
      callback(responseJSON);
      }catch(error) {
        if(!gotResponse){
          // Handle error
          console.log(error);
          //Network Connection Problem
          callback(undefined);
        }
      }
  }
};
