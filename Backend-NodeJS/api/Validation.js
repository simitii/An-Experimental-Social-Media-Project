exports.username = function(text){
	if(!checkNull(text)){
		return false;
	}
	var reg = new RegExp("[\'\"!@#$%ˆ&*()_+=-?/.,<>:;|± ]");
	if(reg.test(text)){
		return false;
	}
	return true;
}

function name(text){
	if(!checkNull(text)){
		return false;
	}
	var reg = new RegExp("[\'\"!@#$%ˆ&*()_+=-?/.,<>:;|±]");
	if(reg.test(text)){
		return false;
	}
	return true;
}

exports.firstName = function(text){
	if(!checkNull(text)){
		return false;
	}
	return name(text);
}

exports.lastName = function(text){
	if(!checkNull(text)){
		return false;
	}
	return name(text);
};

exports.password = function(text){	
	if(!checkNull(text)){
		return false;
	}
	var reg = new RegExp("[\'\"|;:]");
	if(reg.test(text)){
		return false;
	}
	return true;
};
exports.type = function(type){
	return true;
};
exports.ifIdUndefined = function(text){
	if(text == undefined || text == null ||  text == ""){
		return true;
	}
	return false;
}

function checkNull(text){
	if(text == undefined || text == null ||  text == ""){
		return false;
	}
	return true;
}