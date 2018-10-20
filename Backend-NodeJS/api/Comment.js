var ObjectId = require('mongodb').ObjectId;

//===========CREATE COMMENT AND SUBCOMMENT ============
exports.create = function(db,req,res){
	//TODO implement ACCESS CONTROL!!!
	var comment = {};
	comment.username = req.loginData.username;
	comment.anonim = req.body.anonim;
	if(comment.anonim){
		comment.username = undefined;
	}
	comment.text = req.body.text;
	comment.photo = undefined;
	comment.video = undefined;
	comment.subComments = [];
	comment.peopleLiked = [];
	comment.likes = 0;
	comment.followers = [];
	comment.follows = 0;

	for(x in req.files){
		if(req.files[x].fieldname == "video"){
			comment.video = '/api/uploads/' + req.files[x].filename;
		}else if(req.files[x].fieldname == "photo" && !comment.photo){
			comment.photo = '/api/uploads/' + req.files[x].filename;
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
	
	if(req.body.campaignID){
		var campaignQuery = {};
		campaignQuery._id = new ObjectId(req.body.campaignID);
		db.insert('comment',comment,function(error){
			if(error === null){
				db.findOneAndUpdate('campaign',campaignQuery,{$push:{"comments":comment._id}},function(err,doc){
					console.log(doc);
					if(err === null && doc.value){
						res.type('json');
						res.send({"state":"1","comment":{"_id":comment._id, "username":comment.username,"text":comment.text,"photo":comment.photo,"video":comment.video,"likes":comment.likes,"follows":comment.follows,"followed":false,"liked":false,"subComments":comment.subComments}});
					}else{
						console.log(err);
						req.deleteAllFiles(req.files);
						res.type('json');
						res.send({"state":"7"});
					}
					});
			}
			else{
				req.deleteAllFiles(req.files);
				console.log(error);
				res.type('json');
				res.send({"state":"9"});
			}
		});
	}else{
		req.deleteAllFiles(req.files);
		res.type('json');
		res.send({"state":"7"}); //invalid campaign id
	}
};

exports.createSubComment = function(db,req,res){
	//TODO implement ACCESS CONTROL!!!
	var comment = {};
	comment.username = "Anonim";
	if(comment.anonim == false){
		comment.username = req.loginData.username;
	}
	comment.text = req.body.text;
	comment.peopleLiked = [];
	comment.likes = 0;
	var query = {};
	query['_id'] = new ObjectId(req.body.commentID);
	db.insert('comment',comment,function(error){
		if(error === null){
			db.findOneAndUpdate('comment',query,{$push:{'subComments':comment._id}},function(err,doc){
			console.log(doc);
			if(err === null && doc.value){
				res.type('json');
				res.send({"state":"1","comment":{"_id":comment._id, "username":comment.username,"text":comment.text,"likes":comment.likes,"liked":false}});
			}else{
				res.type('json');
				res.send({"state":"7"});
			}
			});
		}else{
			res.type('json');
			res.send({"state":"9"});
		}
	});
};

// =============== EDIT COMMENT AND SUBCOMMENT ============

exports.edit = function(db,req,res){
	var username = req.loginData.username;
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	if(req.loginData.type == "admin"){
		accessGranted();
	}else{
		db.find('comment',query,function(err,docs){
			if(err === null && docs !== undefined){
				if(docs[0].username == username)
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

exports.editSubComment = function(db,req,res){

};

// ============== LIKE & FOLLOW ===========================
exports.like = function(db,req,res){
	var username = req.loginData.username;
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	db.find('comment',query,function(err,doc){
		if(err === null && doc[0] !== undefined){
			console.log(doc[0].peopleLiked.indexOf(username));
			if(doc[0].peopleLiked.indexOf(username) === -1){
				db.findOneAndUpdate('comment',query,{$push:{"peopleLiked":username},$inc:{"likes":1}},function(err){
					if(err === null)
						res.send("1");
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
}
exports.unlike = function(db,req,res){
	var username = req.loginData.username;
	console.log(username);
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	db.find('comment',query,function(err,doc){
		if(err === null && doc[0] !== undefined){
			console.log("ajlkdasdk");
			var index = doc[0].peopleLiked.indexOf(username);
			if(index !== -1){
				db.findOneAndUpdate('comment',query,{$pop:{"peopleLiked":-(index+1)},$inc:{"likes":-1}},function(err){
					if(err === null)
						res.send("1");
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
}
exports.follow = function(db,req,res){
	var username = req.loginData.username;
	console.log(username);
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	db.find('comment',query,function(err,doc){
		if(err === null && doc[0] !== undefined){
			if(doc[0].peopleLiked.indexOf(username) === -1){
				db.findOneAndUpdate('comment',query,{$push:{"followers":username},$inc:{"follows":1}},function(err){
					if(err === null)
						res.send("1");
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
}
exports.unfollow = function(db,req,res){
	var username = req.loginData.username;
	console.log(username);
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	db.find('comment',query,function(err,doc){
		if(err === null && doc[0] !== undefined){
			var index = doc[0].followers.indexOf(username);
			if(index !== -1){
				db.findOneAndUpdate('comment',query,{$pop:{"followers":-(index+1)},$inc:{"follows":-1}},function(err){
					if(err === null)
						res.send("1");
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
}


exports.likeSubComment = function(db,req,res){
	var username = req.loginData.username;
	var query = {};
	query['_id'] = new ObjectId(req.body._id);
	db.find('comment',query,function(err,doc){
		if(err === null && doc[0] !== undefined){
			console.log(doc[0].peopleLiked.indexOf(username));
			if(doc[0].peopleLiked.indexOf(username) === -1){
				db.findOneAndUpdate('comment',query,{$push:{"peopleLiked":username},$inc:{"likes":1}},function(err){
					if(err === null)
						res.send("1");
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
}
exports.unlikeSubComment = function(db,req,res){

}

// ============== DELETE COMMENT AND SUB COMMENT ==========

exports.delete = function(db,req,res){

};

exports.deleteSubComment = function(db,req,res){

};

// ============== GET =====================================

exports.get = function(db,req,res){
	//TODO implement ACCESS CONTROL!!
	var query = {};
	query._id = new ObjectId(req.body._id);
	db.find('comment',query,function(err,doc){
		if(err === null){
			res.type('json');
			res.send(doc[0]);
		}else
			res.send("9");
	});
};

exports.getFew = function(db,req,res){
	var commentIDs = [];
	for(i in req.body.commentIDs){
		commentIDs.push(new ObjectId(req.body.commentIDs[i]));
	}
	var username = req.loginData.username;
	db.find('comment',{ _id: { $in: commentIDs } },function(err,docs){
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
				return {"_id":doc._id, "username":doc.username,"text":doc.text,"photo":doc.photo,"video":doc.video,"likes":doc.likes,"follows":doc.follows,"followed":followed,"liked":liked,"subComments":doc.subComments};
			});
			res.type('json');
			res.send(result);
		}else
			res.send("9");
	});
}

