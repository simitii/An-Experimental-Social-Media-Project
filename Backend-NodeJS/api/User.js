var Validation = require('./Validation');
var ObjectId = require('mongodb').ObjectId;
var Cookie = require('./Cookie');
var UserActivity = require('./UserActivity');

// ======= USER METHODS ========

function validate(username,password){
if(!Validation.username(username)){
return "2";
}
if(!Validation.password(password)){
return "3"
}
return "1";
}

exports.register = function(db,req,res){
var username = req.body.username;
var password = req.body.password;
var type = req.body.type;
var code = validate(username,password);

if(code === "1"){
	var user = {};
	user.username = username;
	user.password = password;
	user.type = type;
	user.photo = null;
	user.firstName = null;
	user.lastName = null;
	user.visitedPlaces = [];
	user.visitedTopics = [];
	user.statueForNow = {};
	user.email=null;
	user.followers=[];
	user.followed=[];
	user.comments=[];
	user.oldChallenges=[];
	user.challenges=[];
	user.challengePoint=0;
	user.challangeProposals=[]
	db.insert('user',user,function(err){
	if(err === null)
		res.send("1");
	else
		res.send("9");
	});
}else{
	res.send(code);
}
};

exports.login = function(db,req,res){
var username = req.body.username;
var password = req.body.password;
var type = null;
var code = validate(username,password);
if(code === "1"){
	var query = {};
	query["username"] = username;
	db.find('user',query,function(err,docs){
	if(err === null){
		if(docs.length < 1)
			code = "2";
		else{
			if(docs[0].password !== password)
				code = "4";
			else{
				code = "1";
				type = docs[0].type;
			}
		}
	}else
	code = "9";
	if(code !== "1"){
		res.send(code);
		return;
	}
	var data = {};
	data['login'] = true;
	data['type'] = type;
	var info = {};
	info['username'] = username;
	info['data'] = data;
	var newCookie = Cookie.create(info);
	var cookieOptions = {};
	cookieOptions['expires'] = newCookie.expires;
	res.cookie('info',newCookie,cookieOptions);
	res.cookieSended = {};
	res.cookieSended.info = newCookie;
	res.send("1");
});
}else{
	res.send(code);
}
};

exports.edit = function(db,req,res){
	var properties = ['password','type','firstName','lastName'];
	var request = req.body;
	var query = {};
	query['username'] = req.loginData.username;
	var update = {};
	var isEmpty = true;
	for(ii in properties){
		var property = properties[ii];
		if(request[property] !== undefined){
			if(Validation[property](request[property])){
			update[property] = request[property];
			isEmpty = false;
			}else{
				res.send("Invalid " + property.toUpperCase());
				return;
			}
		}
	}
	for(x in req.files){
		if(req.files[x].fieldname == req.loginData.username){
			photo = '/api/uploads/' + req.files[x].filename;
		}else{
			req.deleteFile(req.files[x].path,function(err) {
			   if (err) {
			      return console.error(err);
			   }
			   req.files.splice(x,x+1);
			   console.log("Unknown File deleted successfully!");
			});
		}
	}
	if(!isEmpty){
	db.update('user',query,{$set : update},function(err){
		if(err === null){
			res.send("1");
		}
	});
}
};

exports.get = function(db,req,res){
	var query = {};
	query['username'] = req.body.username==null?req.loginData.username:req.body.username;
	var user = {};
	db.find('user',query,function(err,doc){
		if(err === null){
			if(doc.length > 0){
				 res.send(doc[0]);
			}
			else
				res.send("2");
		}
		else{
			res.send("9");
		}
	});
};

exports.delete = function(db,req,res){
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	db.remove('user',query,function(err){
		if(err === null)
			res.send("1");
		else
			res.send("9");
	});
};

exports.checkCookieForLogin = function(req,res){
	if(req.cookies.info !== undefined){
		var data = Cookie.verifyAndGetData(req.cookies.info);
		if(data === null){
			res.clearCookie('info');
			res.send('Invalid Cookie!');
		}else{
			res.type('json');
			res.send(data);
		}
	}else{
		res.send('No Cookie Found!');
	}
};


// ========= NEWSFEED FOR MAIN PAGE =======

exports.getNewsfeed = function(db,req,res){
	var result = [];
	var gettingCampaingsDone = false;
	var gettingNewsfeedNotificationsDone = false;
	var username = req.loginData.username;
	//Getting Campaigns
	db.find('campaign',{},function(err,docs){
		if(err == null){
			docs = docs.map(function(doc){
				return doc._id;
			});
			result = result.concat(docs);
			gettingCampaingsDone = true;
			sendResult();
		}else{
			res.send("9");
		}
	});
	//Find Users Followed
	db.find('user',{'username' : username},function(err,doc){
		if(!err){
			var usernames = undefined;
			if(doc[0] && Array.isArray(doc[0].followed)){
				usernames = doc[0].followed;
			}else{
				usernames = [];
			}
			console.log("username:" + usernames);
			getActivities(usernames);
		}else{
			console.log("Username!!! " + err);
			res.send("9");
		}
	});
	//Getting UserActivities of Followed Users
	function getActivities(usernames){
		var LIMIT = 50;
		db.limittedFind('UserActivity',{username: { $in: usernames }},LIMIT,function(err,docs){
			if(!err){
				docs = docs.map(function(doc){
					return doc._id;
				});
				result = result.concat(docs);
				gettingNewsfeedNotificationsDone = true;
				sendResult();
			}else{
				console.log("UserActivity!!! " + err);
				res.send("9");
			}
		});
	};

	function sendResult(){
		if(gettingCampaingsDone && gettingNewsfeedNotificationsDone){
			res.type('json');
			res.send(result);
		}
	}
};

exports.getNewsfeedData = function(db,req,res){
	var result = [];
	var gettingCampaingsDone = false;
	var gettingNewsfeedNotificationsDone = false;
	var ids = req.body.newsfeed || [];
	var username = req.loginData.username;
	ids = ids.map(function(id){
		return new ObjectId(id);
	});
	//Getting Campaigns
	db.find('campaign',{_id: { $in: ids }},function(err,docs){
		if(err == null){
			console.log(docs);
			docs = docs.map(function(doc){
				let followed = false;
				if(doc.followers != undefined && doc.followers != null){
					followed = doc.followers.indexOf(username) !== -1;
				}
				let liked = false;
				if(doc.peopleLiked != undefined && doc.peopleLiked != null){
					liked = doc.peopleLiked.indexOf(username) !== -1;
				}
				return {"type":"Campaign", "_id":doc._id, "name":doc.name,"shortDescription":doc.shortDescription,"coverPicture":doc.coverPicture,"point":doc.point,"followed":followed,"liked":liked,"numberOfFollowers":doc.followers.length,"numberOfPeopleLiked":doc.peopleLiked.length,"numberOfComments":doc.comments.length};
			});
			result = result.concat(docs);
			gettingCampaingsDone = true;
			sendResult();
		}else{
			res.send("9");
		}
	});
	//Getting UserActivities of Followed Users
	db.find('UserActivity',{_id: { $in: ids }},function(err,docs){
		if(err == null){
			console.log(docs);
			result = result.concat(docs);
			gettingNewsfeedNotificationsDone = true;
			sendResult();
		}else{
			res.send("9");
		}
	});

	function sendResult(){
		if(gettingCampaingsDone && gettingNewsfeedNotificationsDone){
			res.type('json');
			res.send(result);
		}
	}
};

// ========= NEWSFEED FOR USER PROFILE =============

exports.getProfileNewsFeed = function(db,req,res){
	var query = {};
	query['username'] = req.loginData.username;
	db.find('UserActivity',query,function(err,docs){
		if(!err){
			docs = docs.map(function(doc){
				return doc._id;
			});
			res.type('json');
			res.send(docs);
		}else{
			res.send("9");
		}
	});
};

// ======== CHALLANGE PROPOSAL HANDLING ============

exports.proposeChallange = function(db,req,res){
	var proposedUser = req.body.proposedUser;
	var proposedChallange = req.body.proposedChallange;
	if(proposedChallange!=undefined && proposedUser!=undefined){
		var query = {};
		query['username'] = proposedUser;
		db.find('user',query,function(err,doc){
			if(err === null && doc[0] !== undefined){
				if(doc[0].challangeProposals.indexOf(proposedChallange) === -1){
					db.findOneAndUpdate('user',query,{$push:{"challangeProposals":proposedChallange}},function(err){
						if(err === null)
							res.send("1");
						else
							res.send("9");
					});
				}else{
					// already proposed
					res.send("16"); 
				}
			}else
				res.send("9");
		});
	}else{
		res.send("2");
	}
};

// ========= FOLLOW ANOTHER USER ==================

//TODO implement follow user!
exports.follow = function(db,req,res){
	var query = {};
	var username = req.loginData.username;
	query['username'] = username;
	var userToFollow = req.body.userToFollow;
	if(userToFollow!=undefined && userToFollow!=null){
		db.find('user',query,function(err,doc){
			if(err === null && doc[0]){
				if(doc[0].followed == undefined){
					doc[0].followed = [];
				}
				if(doc[0].followed.indexOf(userToFollow) === -1){
					db.findOneAndUpdate('user',query,{$push:{"followed":userToFollow}},function(err){
						if(err === null){
							createUserActivity(userToFollow,userToFollow,null,null);
							res.send("1");
						}
						else
							res.send("9");
					});
				}else{
					// user already liked the content
					res.send("16"); 
				}
			}else
				res.send("9");
		});
		function createUserActivity(objectID,name,photo,shortDescription){
			var activityDetails = {
				'type'            : "follow",
				'username'        : username,
				'objectType'      : "user",
				'objectID'		  : objectID,
				'name'			  : name,
				'photo'           : photo,
				'shortDescription': shortDescription,
			};
			UserActivity.create(db,activityDetails,function(err,doc){
				if(err){
					console.log('UserActivity Creating Error!');
					console.log(err);
				}
			});
		}
	}else{
		res.send("2");
	}
};

exports.unfollow = function(db,req,res){
	var query = {};
	var username = req.loginData.username;
	query['username'] = username;
	var userToFollow = req.body.userToFollow;
	db.find('user',query,function(err,doc){
		if(err === null && doc[0] && doc[0].followed){
			if(doc[0].followed == undefined){
				doc[0].followed = [];
			}
			var index = doc[0].followed.indexOf(userToFollow);
			if(index !== -1){
				db.findOneAndUpdate('user',query,{$pop:{"followed":-(index+1)}},function(err){
					if(err === null){
						deleteUserActivity(userToFollow);
						res.send("1");
					}
					else
						res.send("9");
				});
				function deleteUserActivity(objectID){
					var activityDetails = {
						'type'            : "follow",
						'username'        : username,
						'objectType'      : "user",
						'objectID'		  : objectID,
					};
					UserActivity.findAndDelete(db,activityDetails,function(err,doc){
						if(err){
							console.log('UserActivity Deleting Error!');
							console.log(err);
						}
					});
				}
			}else{
				// user already unfollowed
				res.send("16"); 
			}
		}else{
			//DB ERROR
			res.send("9");
		}
	});
}

// ========= CHALLENGE METHODS FOR USER ===========


exports.leaveChallenge = function(db,req,res){
	var query = {};
	query['username'] = req.loginData.username;
	var _id= new ObjectId(req.body.challengeId);
	var challenge={};
	challenge['challengeId']=req.body.challengeId;
	var dateee = new Date();
	var wholeDate = dateee.getDate() + '/' + (dateee.getMonth() + 1) + '/' + dateee.getFullYear()  ;
	challenge['finishDate']=wholeDate;
	challenge['startDate']=req.body.startDate;
	challenge['name']=req.body.challengeName;
	db.find('user',query,function(err,doc){
		console.log("1111111111111111"+req.body.startDate);
		if(err === null && doc[0] !== undefined){
			console.log("222222222222222222"+_id+"   ");

				console.log("SAMET");
				db.findOneAndUpdate('user',query,{$pull:{'challenges':{'challengeId':req.body.challengeId}},$addToSet :{oldChallenges:challenge}},function(err,doc){
					console.log("fdffff"+doc);
					if(err === null&&doc.value){

						console.log("good");
						res.send("1");
					}else{
							res.send("9");
					}
				});


		}
	});
};
exports.joinChallenge = function(db,req,res){
	var query2 = {};
	query2['username'] = req.loginData.username;
	var _id=  new ObjectId(req.body.challengeId);
	var user= req.loginData.username;
	query2['challenges.challengeId']=req.body.challengeId;
	var query = {};
	query['username']= req.loginData.username;
	var challenge={};
	challenge['name']=req.body.name;
	challenge['shortDescription']=req.body.shortDescription;
	challenge['coverPicture']=req.body.coverPicture;
	challenge['challengeId']=req.body.challengeId;
	challenge['startDate']=req.body.startDate;
	challenge['completed']=req.body.completed;
	var challengeQuery= {};
	challengeQuery['_id']=_id;
	console.log("1!!!111111");
		db.find('user',query,function(err,doc){
			if(err === null){
				console.log("222222222");
				db.find('user',query2,function(err,doc){
					console.log("3333333333333333"+err);
					console.log("3333333333333333"+doc[0]);

					if(err===null&&doc[0]===undefined){
						console.log("4444444444444444444");

						db.update('user',query,{$addToSet :{challenges:challenge}},function(err){

							if(err === null){
								console.log("555555555555555555");

								//also adds to campaign attendance array
								db.update('campaign',challengeQuery,{$addToSet:{attendance:user}},function(err){
									console.log("666666666"+err);

									if(err===null){
										console.log("77777777777");

											res.send("1");
									}
								})
							}else{
									res.send("2");
							}
						});
					}
				});
			}
			else{
				res.send("9");
			}
		});
};

exports.getOldChallenges = function(db,req,res){
	var query = {};
	query['username'] = req.loginData.username;
	var user = {};
	db.find('user',query,function(err,doc){
		if(err === null){
			if(doc.length > 0)
				res.send(doc[0].oldChallenges);
			else
				res.send("2");
		}
		else{
			res.send("9");
		}
	});
};
exports.getChallenges = function(db,req,res){
	var query = {};
	query['username'] = req.body.username;
	var user = {};
	db.find('user',query,function(err,doc){
		if(err === null){
			if(doc.length > 0)
				res.send(doc[0].challenges);
			else
				res.send("2");
		}
		else{
			res.send("9");
		}
	});
};

exports.getCompleted=function(db,req,res){
	var query = {};
	query['username'] = req.loginData.username;
	var _id=  new ObjectId(req.body.challengeId);
	var completedNumber=req.body.completedNumber;
	query['challenges.challengeId']=req.body.challengeId;
	db.find('user',{$and:[query]},function(err,doc){
		console.log("1111111111111111");
		if(err === null && doc[0] !== undefined){
			console.log("222222222222222222");
			var index = doc[0].challenges.indexOf(_id);
			var ind=index.toString();
				console.log("SAMET");
				db.update('user',query,{$inc: { "challenges.$.completed":+1,"challengePoint":completedNumber  }},function(err,doc){
					console.log("fdffff"+err);
					if(err === null){
						res.send("1");
					}else{
						res.send("9");
					}
				});
		}
	});
};
//TODO learn how to index and change the index algorithmmo
exports.checkChallenge = function(db,req,res){
	var query = {};
	query['username'] = req.loginData.username;
	var _id=  new ObjectId(req.body.challengeId);

	query['challenges.challengeId']=req.body.challengeId;
	var user = {};
	console.log("ALLLAHHHH");
	db.findWithPreferences('user',query,{'challenges.$':1},function(err,doc){
		console.log("KKKKKKKKKKKKKKKKkkk"+doc);
		if(err === null){
			if(doc.length > 0){
				var result={};
				result['startDate']=doc[0].challenges[0].startDate;
				result['completed']=doc[0].challenges[0].completed;
				console.log(result.startDate);
				res.type('json');
				res.send(result);
			}
		}
	});
};



