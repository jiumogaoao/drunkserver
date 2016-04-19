//event.js 
var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter(); 
var catchs = {};
var callBackFn = function(data){}

event.on('server', function() {
	if(catchs.model&&catchs.action){
		if(server[catchs.model]&&server[catchs.model][catchs.action]){
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
