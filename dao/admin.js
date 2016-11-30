var admin={}
admin.login=function(socket,data){
	data_mg.admin.findOne({name:data.name,key:data.key},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"查询管理员错误"});
		}else{
			if(doc){
				socket.userId=doc["_id"];
				if(loginArry["ID_"+doc["_id"]]&&loginArry["ID_"+doc["_id"]].socket){
					delete loginArry["ID_"+doc["_id"]].socket.userId;
				}
				var tk=tool.uuid();
				loginArry["ID_"+doc["_id"]]={};
				loginArry["ID_"+doc["_id"]].socket=socket;
				loginArry["ID_"+doc["_id"]].tk=tk;
				loginArry["ID_"+doc["_id"]].type=doc.type;
				loginArry["ID_"+doc["_id"]].userId=doc["_id"];
				loginArry["ID_"+doc["_id"]].admin=true;
				var docA=_.pick(doc,"name","type","_id");
				socket.join('admin');
				socket.emit("login",docA);
				socket.emit('tk',{tk:tk});
			}else{
				socket.emit("err",{errDsc:"用户名或密码错误"});
			}
		}
	})
}
admin.get=function(socket,data){
	data_mg.admin.find({},function(err,docs){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"查询管理员列表错误"});
		}else{
			socket.emit("adminGet",docs);
		}
	});
}
admin.add=function(socket,data){
	function noAdmin(){
		var newAdmin=new data_mg.admin({name:data.name,key:data.key,type:data.type});
			newAdmin.save(function(err,doc){
				if(err){
					socket.emit("err",{errDsc:"添加管理员失败"});
					return false;
				}
				io.sockets.to('admin').emit("adminAdd",_.pick(doc,"name","type","_id"));
			});
	}
	data_mg.admin.find({name:data.name},function(err,docs){
		if(err){
			socket.emit("err",{errDsc:"查询管理员错误"});
		}else if(docs&&docs.length){
			socket.emit("err",{errDsc:"管理员已注册"});
		}else{
			noAdmin();
		}
	});
}

admin.remove=function(socket,data){
	data_mg.admin.findOne({_id:data.id},function(err,doc){
		if(err){
			socket.emit("err",{errDsc:"查询管理员错误"});
		}else{
			doc.remove(function(err){
				if(err){socket.emit("err",{errDsc:"删除管理员错误"});}else{
					io.sockets.to('admin').emit("adminRemove",{_id:data.id});
				}
			});
		}
	});
}

admin.change=function(socket,data){
	data_mg.admin.findOne({_id:data.id},function(err,doc){
		if(err){
			socket.emit("err",{errDsc:"查询管理员错误"});
		}else{
			doc.name=data.name;
			doc.type=data.type;
			doc.save(function(err,doc){
				if(err){
					socket.emit("err",{errDsc:"修改管理员错误"});
				}else{
					io.sockets.to('admin').emit("adminChange",_.pick(doc,"name","type","_id"));
				}
			});
		}
	});
}

admin.logout=function(socket,data){
	delete loginArry["ID_"+socket.userId];
	delete socket.userId;
	delete socket.type;
	delete socket.admin;
	socket.leave('admin');
	socket.emit("logout",{logout:true});
	socket.emit("tk",{tk:false});
}

module.exports=admin;