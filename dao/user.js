var user={}
user.login=function(socket,data){
	console.log(data);
	socket.emit("login",{login:true})	
}
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
				socket.emit("regest",{id:doc["_id"],userName:data.userName,phone:data.phone});
			}
		});
	}
	data_mg.user.find({"$or":[{userName:data.userName},{phone:data.phone}]},function(err,docs){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"查询用户错误"});
		}else{
			if(docs.length){
			console.log(docs);
			socket.emit("err",{errDsc:"用户名或手机已注册"});	
			}else{
			noRegested();
			}
		}
	});
}
module.exports=user;