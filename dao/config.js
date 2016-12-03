var config={}
config.get=function(socket,data){
	data_mg.config.find({},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取配置错误"});
		}else{
			socket.emit("configList",doc);
		}
	});
}
config.add=function(socket,data){
	function noConfig(){
		var newConfig=new data_mg.config(data);
		newConfig.save(function(err,doc){
			if(err){
				console.log(err);
				socket.emit("err",{errDsc:"添加配置错误"});
			}else{
				io.sockets.to("admin").emit("configAdd",doc);
			}
		});
	}
	data_mg.config.findOne({version:data.version},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取配置错误"});
		}else if(doc){
			socket.emit("err",{errDsc:"版本重复"});
		}else{
			noConfig();
		}
	});
}
config.change=function(socket,data){
	data_mg.config.update({"_id":data._id},{$set:data},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"更新配置错误"});
		}else{
			io.sockets.to("admin").emit("configChange",doc);
		}
	});
}
config.versionSet=function(socket,data){
	data_mg.config.findOne({version:data.version},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取配置版本错误"});
		}else if(!doc){
			socket.emit("err",{errDsc:"没有该版本配置"});
		}else{
			io.sockets.emit("config",doc);
		}
	});
}
module.exports=config;