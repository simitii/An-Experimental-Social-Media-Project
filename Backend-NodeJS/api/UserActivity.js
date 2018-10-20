
exports.create = function(db,activityDetails,callback){
	/*
	POSSIBLE ACTIVITY TYPES
		LIKE,FOLLOW,COMMENT,SUBCOMMENT,CHALLANGE,SUCCESS,FAIL
	*/
	if(!activityDetails.type){
		console.log('Activity Type not Given!');
		callback('Invalid type!',null);
		return;
	}
	if(!activityDetails.username){
		console.log('Activity Owner not Given!');
		callback('Invalid username!',null);
		return;
	}
	if(!activityDetails.objectType){
		console.log('Activity objectType not Given!');
		callback('Invalid objectType!',null);
		return;
	}
	var activity = {
		'type'            : activityDetails.type,
		'username'        : activityDetails.username,
		'objectType'      : activityDetails.objectType,
		'objectID'		  : activityDetails.objectID,
		'name'			  : activityDetails.name,
		'photo'           : activityDetails.photo,
		'time'            : new Date,
	};
	if(activity.objectType == 'campaign'){
		activity.shortDescription = activityDetails.shortDescription;
	}
	db.insert('UserActivity',activity,callback);
};

exports.getActivities = function(db,usernames,callback){
	var LIMIT = 50;
	db.limittedFind('UserActivity',{username: { $in: usernames }},LIMIT,function(err,docs){
		if(!err){
			docs = docs.map(function(doc){
				return {_id: doc._id, time: doc.time};
			});
			callback(null,docs);
		}else{
			callback(err,null);
		}
	});
};

exports.findAndDelete = function(db,activityDetails,callback){
	if(!activityDetails.type){
		console.log('Activity Type not Given!');
		callback('Invalid type!',null);
		return;
	}
	if(!activityDetails.username){
		console.log('Activity Owner not Given!');
		callback('Invalid username!',null);
		return;
	}
	if(!activityDetails.objectType){
		console.log('Activity objectType not Given!');
		callback('Invalid objectType!',null);
		return;
	}
	if(!activityDetails.objectID){
		console.log('Activity objectID not Given!');
		callback('Invalid objectID!',null);
		return;
	}
	var activity = {
		'type'      : activityDetails.type,
		'username'  : activityDetails.username,
		'objectType': activityDetails.objectType,
		'objectID'  : activityDetails.objectID,
	};
	db.remove('UserActivity',activity,callback);
}