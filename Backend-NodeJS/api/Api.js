var express = require('express');
var router = express.Router()
var db = require('./DataBase');
var user = require('./User');
var campaign = require('./Campaign');
var comment = require('./Comment');
var cookie = require('./Cookie');
var search = require('./Search');


db.connect(function(err){
	if(err === null){
		console.log("DB CONNECTED!");
	}
	else{
		console.log("DB CONNECTION FAILED!");
		console.log(err);
	}
});


// split up route handling

//=========FILES============

router.use('/uploads', express.static(__dirname + '/uploads/'));


//=========USER=============
router.use('/login', function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}

	user.login(db,req,res);
});

router.use('/register', function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	user.register(db,req,res);
});

router.use('/getProfileNewsFeed',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.getProfileNewsFeed(db,req,res);
});

router.use('/getNewsfeed',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.getNewsfeed(db,req,res);
});

router.use('/getNewsfeedData',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.getNewsfeedData(db,req,res);
});

router.use('/getOldChallenges',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.getOldChallenges(db,req,res);
});

router.use('/getChallenges',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.getChallenges(db,req,res);
});
router.use('/sendCompleted',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.getCompleted(db,req,res);
});
router.use('/checkChallenge',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.checkChallenge(db,req,res);
});
router.use('/leaveChallenge',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.leaveChallenge(db,req,res);
});
router.use('/joinChallenge',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.joinChallenge(db,req,res);
});

router.use('/followUser',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.follow(db,req,res);
});

router.use('/unfollowUser',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.unfollow(db,req,res);
});

router.use('/editUser',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.edit(db,req,res);
});

router.use('/getUser',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.get(db,req,res);
});

router.use('/deleteUser',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	user.delete(db,req,res);
});

router.use('/checkCookieForLogin',function(req,res){
	user.checkCookieForLogin(req,res);
});


//===========CAMPAIGN=========
router.use('/createCampaign',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	//if(req.loginData === null){
	//	res.send("17"); //access denied
	//	return;
	//}
	campaign.create(db,req,res);
});
router.use('/getCampaign',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	campaign.get(db,req,res);
});
router.use('/getFewCampaign',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	campaign.getFew(db,req,res);
});
router.use('/getCampaignDetails',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	campaign.getCampaignDetails(db,req,res);
});
router.use('/getCampaignComments',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	setTimeout(function(){
		campaign.getCampaignComments(db,req,res);
	},5000);
});
router.use('/editCampaign',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	campaign.edit(db,req,res);
});
router.use('/likeCampaign',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	campaign.like(db,req,res);
});
router.use('/unlikeCampaign',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	campaign.unlike(db,req,res);
});
router.use('/followCampaign',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	campaign.follow(db,req,res);
});
router.use('/unfollowCampaign',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	campaign.unfollow(db,req,res);
});
router.use('/deleteCampaign',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	campaign.delete(db,req,res);
});

router.use('/getAllCampaigns',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	campaign.getAllCampaigns(db,req,res);
});

//============= COMMENT =============

router.use('/createComment',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	setTimeout(function(){
		comment.create(db,req,res);
	},3000);
});

router.use('/editComment',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	comment.edit(db,req,res);
});

router.use('/deleteComment',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	comment.delete(db,req,res);
});

router.use('/createSubComment',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	/*
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}*/
	setTimeout(function(){
		comment.createSubComment(db,req,res);
	},3000);

});

router.use('/editSubComment',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	comment.editSubComment(db,req,res);
});

router.use('/deleteSubComment',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	comment.deleteSubComment(db,req,res);
});

// WATCH OUT!!! For getting only one comment
router.use('/getComment',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	comment.get(db,req,res);
});

// WATCH OUT!!! For getting more than one comment
router.use('/getFewComments',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	comment.getFew(db,req,res);
});
router.use('/likeComment',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	comment.like(db,req,res);
});
router.use('/unlikeComment',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	comment.unlike(db,req,res);
});

router.use('/followComment',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	comment.follow(db,req,res);
});
router.use('/unfollowComment',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	comment.unfollow(db,req,res);
});

//============= SEARCH ==============

router.use('/search',function(req,res){
	if(!db.isConnected()){
		res.send("9");
		return;
	}
	req.loginData = cookie.verifyAndGetData(req.cookies.info);
	if(req.loginData === null){
		res.send("17"); //access denied
		return;
	}
	search.simpleSearch(db,req,res);
});

router.use('/',function(req,res){
	res.send("10");
	console.log("Unknown SubPath");
});

// return the router
module.exports = router;
