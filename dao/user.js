var user={}
user.regest=function(socket,data){
	function noRegested(){
		var newId=tool.uuid();
		var newUser=new data_mg.user({id:newId,userName:data.userName,phone:data.phone,key:data.key});
		newUser.save(function(err,doc){
			if(err){
				console.log(err);
				socket.emit("err",{errDsc:"添加用户错误"});
			}else{
				socket.userId=doc["_id"];
				var tk=tool.uuid();
				loginArry["ID_"+doc["_id"]]={socket:socket,tk:tk,userId:doc["_id"]};
				var docA=_.pick(doc,"userName","name","phone","icon","background","dsc","sex","provinceID","cityID","birthday","email","place","type","balance","balanceList","shoppingCart","buyList");
				socket.emit("regest",docA);
				socket.emit('tk',{tk:tk});
			}
		});
	}
	data_mg.user.find({"$or":[{userName:data.userName},{phone:data.phone}]},function(err,docs){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"查询用户错误"});
		}else{
			if(docs.length){
			socket.emit("err",{errDsc:"用户名或手机已注册"});	
			}else{
			noRegested();
			}
		}
	});
}
user.login=function(socket,data){
	data_mg.user.findOne({userName:data.userName,key:data.key},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"查询用户错误"});
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
				loginArry["ID_"+doc["_id"]].userId=doc["_id"];
				var docA=_.pick(doc,"userName","name","phone","icon","background","dsc","sex","provinceID","cityID","birthday","email","place","type","balance","balanceList","shoppingCart","buyList");
				socket.emit("login",docA);
				socket.emit('tk',{tk:tk});
			}else{
				socket.emit("err",{errDsc:"用户名或密码错误"});
			}
		}
	})
}
user.logout=function(socket,data){
	delete loginArry["ID_"+socket.userId];
	delete socket.userId;
	console.log(socket)
	socket.emit("logout",{logout:true});
	socket.emit("tk",{tk:false});
}
user.recharge=function(socket,data){
	if(!socket.userId){
		socket.emit("err",{errDsc:"请先登录"});
		return false;
	}
	data_mg.user.findById(socket.userId,function(err, doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取用户信息失败"});
			return false;
		}
		if(!doc.balance){
			doc.balance=0;
		}
		doc.balance+=data.money;
		doc.save(function(err,doc){
			if(err){
				console.log(err);
				socket.emit("err",{errDsc:"充值失败"});
				return false;
			}
			socket.emit("balance",{balance:doc.balance});
		});
	});
}
module.exports=user;