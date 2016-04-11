//event.js 
var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter(); 
var catchs = {};
var callBackFn = function(data){}

event.on('server', function() {
	console.log("server");
	if(catchs.model&&catchs.action){console.log(catchs);
		if(server[catchs.model]&&server[catchs.model][catchs.action]){console.log("actionFind");
			server[catchs.model][catchs.action](null,catchs,callBackFn);
			}
		
	}
}); 
exports.run = function(name){
	event.emit(name);
};
exports.catchs = function(data){
	catchs=data;
}
exports.callBackFn = function(fn){
	callBackFn = fn;
}
