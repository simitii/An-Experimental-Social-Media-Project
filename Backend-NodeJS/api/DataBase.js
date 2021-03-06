var MongoClient = require('mongodb').MongoClient;

// Connection URL
//var url = "mongodb://admin:dIGDHbech3C9e5E2@challangeapp-shard-00-00-95hch.mongodb.net:27017,challangeapp-shard-00-01-95hch.mongodb.net:27017,challangeapp-shard-00-02-95hch.mongodb.net:27017/challangeapp?ssl=true&replicaSet=ChallangeApp-shard-0&authSource=admin";
var url = 'mongodb://localhost:27017/test';

var _db = null;
// Use connect method to connect to the server

exports.connect = function(callback){
  if(_db === null){
  MongoClient.connect(url, function(err, db) {
    //console.log(err);
  if(err === null){
    _db = db;
  }
    callback(err);
});
}else{
    callback(null);
}
}

exports.isConnected = function(){
  if(_db === null){
    return false;
  }
  return true;
};

exports.getDB = function(){
  return _db;
}

exports.close = function(){
    _db.close();
    _db = null;
  };

exports.insert = function(collection,doc,callback){
    _db.collection(collection).insert(doc,callback);
  };
  exports.findWithPreferences = function(collection,query,preferences,callback){
      _db.collection(collection).find(query,preferences).toArray(callback);
    };
exports.find = function(collection,query,callback){
    _db.collection(collection).find(query).toArray(callback);
  };
exports.limittedFind = function(collection,query,limit,callback){
    _db.collection(collection).find(query).limit(limit).toArray(callback);
  };
exports.remove = function(collection,query,callback) {
    _db.collection(collection).remove(query,callback);
  };
exports.update = function(collection,query,updates,callback){
    _db.collection(collection).update(query,updates,callback);
  };
exports.findOneAndUpdate = function(collection,query,updates,callback){
    _db.collection(collection).findOneAndUpdate(query,updates,callback);
  };
exports.findOneAndDelete = function(collection,query,callback) {
    _db.collection(collection).findOneAndDelete(query,callback);
  };
