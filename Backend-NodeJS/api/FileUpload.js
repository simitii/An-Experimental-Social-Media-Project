var multer = require('multer');
var fs = require("fs");

module.exports= function(req,res,callback){
	var storage =   multer.diskStorage({
  	destination: function (req, file, callback) {
    	callback(null, __dirname + '/uploads');
  	},
  	filename: function (req, file, callback) {
  		var filename = file.fieldname + '-' + Date.now();
    	callback(null, filename);
  	}
	});
	var upload = multer({ storage : storage}).any();
	upload(req,res,function(err) {
    	if(err) {
        	return callback(err);
    	}
      req.deleteFile = function(path,callback){
        fs.unlink(path,callback);
      };
      req.deleteAllFiles = function(files){
        for(x in files){
          fs.unlink(files[x].path,function(err){
            if(err){
              console.error(err);
            }
            console.log("Temp File deleted successfully!");
          });
        }
      }
    	callback(null);
	});
};