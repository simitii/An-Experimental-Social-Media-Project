var ObjectId = require('mongodb').ObjectId;
var Validation = require('./Validation');
var UserActivity = require('./UserActivity');


var DOMAIN = 'http://localhost:8080'

// ======== CREATION OF CAMPAIGN =======

// Create a new campaign by combining topic and place
exports.create = function(db,req,res){
	//var check = checkCampaignData(req.body);
	//if(check != null){
	//	res.send(check);
	//	return;
	//}
	console.log(req);
	var campaign = {};
	campaign.name = req.body.name;
	campaign.organizers = req.body.organizers || [];
	campaign.shortDescription = req.body.shortDescription;
	campaign.detailedDescription = req.body.detailedDescription;
	campaign.StartDate = req.body.StartDate;
	campaign.point = 0;
	campaign.followers = campaign.organizers;
	campaign.attendance = [];
	campaign.comments = [];
	campaign.peopleLiked = [];
	campaign.coverPicture = undefined;
	campaign.descriptionPictures = [];
	//copies the array
	campaign.subChallenges=req.body.subChallenges.slice(0);
	campaign.isPrivate=req.body.isPrivate;
	campaign.isDaily=req.body.isDaily;
	for(x in req.files){
		if(req.files[x].fieldname == "cover"){
			campaign.coverPicture = '/api/uploads/' + req.files[x].filename;
		}else if(req.files[x].fieldname == "des-pict"){
			campaign.descriptionPictures.push('/api/uploads/' + req.files[x].filename);
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
	campaign.descriptionPictures = JSON.stringify(campaign.descriptionPictures);
	var query = {};
	query['name'] = campaign.name;
	db.find('campaign',query,function(err,doc){
		if(err === null && doc.length < 1){
			db.insert('campaign',campaign,function(error){

				if(error === null)
					res.send("1");
				else{
					req.deleteAllFiles(req.files);
					console.log(error);
					res.send("9");
				}
			});
		}else if(doc.length > 0){
			req.deleteAllFiles(req.files);
			res.send("6");
		}else{
			req.deleteAllFiles(req.files);
			res.send("9");
		}
	});
};

function checkCampaignData(campaign){
	if(!checkStringWithCharacterLimit(campaign.name,75)){
		return "11"; //invalid name error
	}
	if(!Array.isArray(campaign.organizers)){
		return "12"; //invalid organizers error
	}
	if(!checkStringWithCharacterLimit(campaign.shortDescription,200)){
		return "13"; //invalid shortDescription error
	}
	if((typeof campaign.detailedDescription) != "string"){
		return "14"; // invalid detailedDescription error
	}
	return null;
}
function checkStringWithCharacterLimit(string,limit){
	if((typeof string) != "string"){
		return false;
	}
	if(string.length > limit){
		return false;
	}
	return true;
}

// ========= EDIT/LIKE/FOLLOW/ADDNEWORGANIZER ============

//Edit the campaign with requested id
exports.edit = function(db,req,res){
	var username = req.loginData.username;
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	if(req.loginData.type === "admin"){
		accessGranted();
	}else{
		db.find('campaign',query,function(err,docs){
			if(err === null && docs !== undefined){
				if(docs[0].organizers.indexOf(username) >= 0)
					accessGranted();
				else
					res.send("17"); //access denied!
			}else{
				res.send("9");
			}
		});
	}
	function accessGranted(){
		var properties = ['name','organizers','shortDescription','detailedDescription','StartDate','FinishDate'];
		var isEmpty = true;
		var update = {};
		var request = req.body;
		for(ii in properties){
			var property = properties[ii];
			if(request[property] !== undefined){
				/*if(Validation[property](request[property])){
				update[property] = request[property];
				isEmpty = false;
				}else{
					res.send("Invalid " + property.toUpperCase());
					return;
				}*/
				//ADD VALIDATION AS IT IS IN UP EXAMPLE
				isEmpty = false;
				update[property] = request[property];
			}
		}
		if(!isEmpty){
			db.update('campaign',query,{$set : update},function(err){
				if(err === null){
					res.send("1");
				}
				else{
					res.send("9");
				}
			});
		}
	}
};

//Increases the point (Like Button)
exports.like = function(db,req,res){
	var username = req.loginData.username;
	console.log(username);
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	//campaign.point => campaign.point+1
	db.find('campaign',query,function(err,doc){
		if(err === null && doc[0] !== undefined){
			console.log(doc[0].peopleLiked.indexOf(username));
			if(doc[0].peopleLiked.indexOf(username) === -1){
				db.findOneAndUpdate('campaign',query,{$push:{"peopleLiked":username},$inc:{"point":1}},function(err,doc){
					if(err === null){
						createUserActivity(doc.value._id,doc.value.name,doc.value.coverPicture,doc.value.shortDescription);
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
			'type'            : "like",
			'username'        : username,
			'objectType'      : "campaign",
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
};

//Decreases the point (Unlike Button)
exports.unlike = function(db,req,res){
	var username = req.loginData.username;
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	//campaign.point => campaign.point+1
	db.find('campaign',query,function(err,doc){
		if(err === null && doc[0] !== undefined){
			console.log("ajlkdasdk");
			var index = doc[0].peopleLiked.indexOf(username);
			if(index !== -1){
				db.findOneAndUpdate('campaign',query,{$pop:{"peopleLiked":-(index+1)},$inc:{"point":-1}},function(err,doc){
					if(err === null){
						deleteUserActivity(doc.value._id);
						res.send("1");
					}
					else
						res.send("9");
				});
			}else{
				// user already unliked the content
				res.send("16");
			}
		}else{
			res.send("9");
		}
	});

	function deleteUserActivity(objectID){
		var activityDetails = {
			'type'            : "like",
			'username'        : username,
			'objectType'      : "campaign",
			'objectID'		  : objectID,
		};
		UserActivity.findAndDelete(db,activityDetails,function(err,doc){
			if(err){
				console.log('UserActivity Deleting Error!');
				console.log(err);
			}
		});
	}
};

//Follow the campaign
exports.follow = function(db,req,res){
	var username = req.loginData.username;
	console.log(username);
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	//campaign.point => campaign.point+1
	db.find('campaign',query,function(err,doc){
		if(err === null && doc[0] !== undefined){
			if(doc[0].peopleLiked.indexOf(username) === -1){
				db.findOneAndUpdate('campaign',query,{$push:{"followers":username}},function(err,doc){
					if(err === null){
						createUserActivity(doc.value._id,doc.value.name,doc.value.coverPicture,doc.value.shortDescription);
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
			'objectType'      : "campaign",
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
};

//UnFollow
exports.unfollow = function(db,req,res){
	var username = req.loginData.username;
	console.log(username);
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	db.find('campaign',query,function(err,doc){
		if(err === null && doc[0] !== undefined){
			var index = doc[0].followers.indexOf(username);
			if(index !== -1){
				db.findOneAndUpdate('campaign',query,{$pop:{"followers":-(index+1)}},function(err,doc){
					if(err === null){
						deleteUserActivity(doc.value._id);
						res.send("1");
					}
					else
						res.send("9");
				});
			}else{
				// user already unfollowed the content
				res.send("16");
			}
		}else{
			res.send("9");
		}
	});

	function deleteUserActivity(objectID){
		var activityDetails = {
			'type'            : "follow",
			'username'        : username,
			'objectType'      : "campaign",
			'objectID'		  : objectID,
		};
		UserActivity.findAndDelete(db,activityDetails,function(err,doc){
			if(err){
				console.log('UserActivity Deleting Error!');
				console.log(err);
			}
		});
	}
};

// =========== GET CAMPAIGNS ========

//Get the campaign with requested id
exports.get = function(db,req,res){
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	db.find('campaign',query,function(err,doc){
		if(err === null){
			res.type('json');
			res.send(doc[0]);
		}else
			res.send("9");
	});
};

//Get Few Campaigns By CampaignIDs
exports.getFew = function(db,req,res){
	var campaignIDs = [];
	for(i in req.body.campaignIDs){
		campaignIDs.push(new ObjectId(req.body.campaignIDs[i]));
	}
	var username = req.loginData.username;
	db.find('campaign',{ _id: { $in: campaignIDs } },function(err,docs){
		if(err === null){
			var result = docs.map(function(doc){
				let followed = false;
				if(doc.followers != undefined && doc.followers != null){
					followed = doc.followers.indexOf(username) !== -1;
				}
				let liked = false;
				if(doc.peopleLiked != undefined && doc.peopleLiked != null){
					liked = doc.peopleLiked.indexOf(username) !== -1;
				}
				return {"_id":doc._id, "name":doc.name,"shortDescription":doc.shortDescription,"coverPicture":doc.coverPicture,"point":doc.point,"followed":followed,"liked":liked};
			});
			res.type('json');
			res.send(result);
		}else
			res.send("9");
	});
};


//Get Campaign Details
exports.getCampaignDetails = function(db,req,res){
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	console.log(query);
	db.find('campaign',query,function(err,doc){
		console.log('err : ' + err);
		console.log('doc : ' + doc);
		if(err === null && doc.length > 0){
			res.type('json');
			res.send(doc[0]);
		}else{
			res.send("9");
		}
	});
}

//Get Comments
exports.getCampaignComments = function(db,req,res){
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	db.find('campaign',query,function(err,doc){
		if(err === null){
			if(doc.comments === undefined){
				doc.comments = [];
			}
			res.type('json');
			res.send(doc.comments);
		}else{
			res.send("9");
		}
	});
}

//NOT RECOMMENDED FOR DAILY USAGE
//Get all of the current campaigns
exports.getAllCampaigns = function(db,req,res){
	db.find('campaign',{},function(err,docs){
		res.type('json');
		res.send(docs);
	});
};


// ============= DELETE ============

//Delete the campaign with requested id
exports.delete = function(db,req,res){
	if(Validation.ifIdUndefined(req.body._id)){
		res.send("7");
		return;
	}
	var username = req.loginData.username;
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	if(req.loginData.type === "admin"){
		accessGranted();
	}else{
		db.find('campaign',query,function(err,docs){
			if(err === null && docs !== undefined){
				if(docs[0].organizers.indexOf(username) >= 0)
					accessGranted();
				else
					res.send("17"); //access denied!
			}else{
				res.send("9");
			}
		});
	}
	function accessGranted(){
	db.remove('campaign',query,function(err,result){
		result = result.result;
		if(err === null && result.n > 0)
			res.send("1");
		else
			res.send("9");
	});
	}
};
