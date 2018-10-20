
exports.simpleSearch = function(db,req,res){
	var username = req.loginData.username;
	var text = req.body.searchFor;
	var result = [];
	searchCampaign(db,text,function(res1){
		if(res1 == "9"){
			res.send("9");
			return;
		}
		result = result.concat(res1.map(function(doc){
				let followed = false;
				if(doc.followers != undefined && doc.followers != null){
					followed = doc.followers.indexOf(username) !== -1;
				}
				let liked = false;
				if(doc.peopleLiked != undefined && doc.peopleLiked != null){
					liked = doc.peopleLiked.indexOf(username) !== -1;
				}
			return {'photo':doc.coverPicture,'description':doc.name,'type':'campaign','_id':doc._id,"followed":followed,"liked":liked,"numberOfFollowers":doc.followers.length,"numberOfPeopleLiked":doc.peopleLiked.length,"numberOfComments":doc.comments.length};
		}));
		searchCampaignDescription(db,text,function(res2){
		if(res2 == "9"){
			res.send("9");
			return;
		}
		result = result.concat(res2.map(function(doc){
				let followed = false;
				if(doc.followers != undefined && doc.followers != null){
					followed = doc.followers.indexOf(username) !== -1;
				}
				let liked = false;
				if(doc.peopleLiked != undefined && doc.peopleLiked != null){
					liked = doc.peopleLiked.indexOf(username) !== -1;
				}
			return {'photo':doc.coverPicture,'description':doc.name,'type':'campaign','_id':doc._id,"followed":followed,"liked":liked,"numberOfFollowers":doc.followers.length,"numberOfPeopleLiked":doc.peopleLiked.length,"numberOfComments":doc.comments.length};
		}));
			searchUsername(db,text,function(res3){
				if(res2 == "9"){
					res.send("9");
					return;
				}
				result = result.concat(res3.map(function(doc){
					return {'photo':null,'description':doc.username,'type':'user','_id':doc.username};
				}));
				res.send(result);
			});
		});
	});
};

var searchCampaign = function(db,text,callback){
	var query = {};
	var regex = new RegExp(text, "i");
	query.name = regex;
	db.find('campaign',query,function(err,doc){
		if(err === null){
			callback(doc);
		}else{
			callback("9");
		}
	});
}

var searchCampaignDescription = function(db,text,callback){
	var query = {};
	var regex = new RegExp(text, "i");
	query.shortDescription = regex;
	db.find('campaign',query,function(err,doc){
		if(err === null){
			callback(doc);
		}else{
			callback("9");
		}
	});
}

var searchUsername = function(db,text,callback){
	var query = {};
	var regex = new RegExp(text, "i");
	query.username = regex;
	db.find('user',query,function(err,doc){
		if(err === null){
			callback(doc);
		}else{
			callback("9");
		}
	});
}

var searchName = function(db,text,callback){
	var query = {};
	var regex = new RegExp(text, "i");
	query.name = regex;
	db.find('user',query,function(err,doc){
		if(err === null){
			callback(doc);
		}else{
			callback("9");
		}
	});
}