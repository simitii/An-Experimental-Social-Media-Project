var crypto = require("crypto");

//setting key
var serverKey = '1#HelloWorld#2';


function hmac(data, key){
	data = JSON.stringify(data);
	var hmac = crypto.createHmac('sha1', key);
	hmac.setEncoding('hex');
	hmac.write(data);
	hmac.end();
	var hash = hmac.read();
	return hash;
}

function cipher(data,key){
	data = JSON.stringify(data);
	var cipher = crypto.createCipher('aes192', key);
	cipher.write(data,'utf8');
	cipher.end();
	var encrypted = cipher.read();
	encrypted = encrypted.toString('hex');
	return encrypted;
}

function decipher(encryptedData,key){
	var decipher = crypto.createDecipher('aes192', key);
	decipher.write(encryptedData,'hex');
	decipher.end();
	var decrypted = decipher.read();
	decrypted =decrypted.toString('utf8');
	return JSON.parse(decrypted);
}

/*
 * verifies given cookie and 
 * returns hidden data inside
 * the cookie
 * @param cookie  given cookie
 * @return data   hidden data
 * if verification fails, it 
 * returns null
 */
exports.verifyAndGetData = function(cookie){
	if(cookie === undefined){
		return null;
	}
	//getting info located in cookie
	var username = cookie.username;
	var expires = cookie.expires;
	var encryptedData = cookie.data;
	var hash = cookie.hash;  
	//check if cookie is expired
 	if(Date.now() > cookie.extime){
 		return null;
 	}
 	var object = {};
 	object['username'] = username;
 	object['expires'] = expires;
 	var key = hmac(object,serverKey);
 	var data = decipher(encryptedData,key);
 	object = {};
 	object['username'] = username;
 	object['expires'] = expires;
 	object['data'] = data;
 	object['serverKey'] = serverKey;
 	var verificationCode = hmac(object,key);
 	if(verificationCode !== hash){
 		return null;
 	}
 	data['username'] = username;
 	return data;
}
exports.create = function(info){
	var username = info.username;
	//30 days expiration time
	var expires = new Date( Date.now() + (30 * 86400000) );
	var data = info.data;
	var object = {};
	object['username'] = username;
	object['expires'] = expires;
	var key = hmac(object,serverKey);
	var encryptedData = cipher(data,key);
	object = {};
	object['username'] = username;
	object['expires'] = expires;
	object['data'] = data;
	object['serverKey'] = serverKey;
	var hash = hmac(object,key);
	var cookie = {};
	cookie['username'] = username;
	cookie['expires'] = expires;
	cookie['data'] = encryptedData;
	cookie['hash'] = hash;
	return cookie;
}

