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
				loginArry["ID_"+doc["_id"]]=socket;
				var docA=_.pick(doc,"userName","name","phone","icon","background","dsc","sex","provinceID","cityID","birthday","email","place","type","balance","balanceList","shoppingCart","buyList");
				socket.emit("regest",docA);
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
				if(loginArry["ID_"+doc["_id"]]){
					delete loginArry["ID_"+doc["_id"]].userId;
				}
				global.loginArry["ID_"+doc["_id"]]=socket;
				var docA=_.pick(doc,"userName","name","phone","icon","background","dsc","sex","provinceID","cityID","birthday","email","place","type","balance","balanceList","shoppingCart","buyList");
				socket.emit("login",docA);
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
}
module.exports=user;