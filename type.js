function get(socket,data,fn){
	console.log("type/get");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var result={
					code:0,
		time:0,
		data:[],
		success:false,
		message:""
					};
	var returnFn=function(){
		if(socket){
	 	socket.emit("type_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	//returnFn();
	//return;
	data_mg.updateTime.find({"parentKey":"type"},function(err,doc){
		if(err){
			result.success=false;
			result.message="获取更新时间失败";
			console.log(err);
			returnFn();
		}else{
			console.log(doc)
			console.log(data.data.time)
			console.log(doc[0].childKey)
			if(doc&&doc.length&&doc[0].childKey>data.data.time){
				result.code=1;
				result.time=doc[0].childKey
				data_mg.type.find({},function(errA,docA){
					if(errA){
						result.success=false;
						result.message="获取项目列表失败";
						console.log(errA);
					}else{
						result.success=true;
						result.data=docA;
					}
					returnFn();
				});
			}else{
				console.log("没更新")
				result.success=true;
				result.code=2;
				returnFn();
			}
		}
	})
	
};

function add(socket,data,fn){
	console.log("type/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var adminData = {
		"id":uuid(),/*id*/
		"name":data.data.name/*类型名*/
		}
		
	var result={
		code:0,
		time:0,
		data:[],
		success:false,
		message:""
		};
	var returnFn=function(){
		if(socket){
	 	socket.emit("type_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.type==2){
		var newType=new data_mg.type(adminData);
	newType.save(function(err,Clientsc){
		console.log(Clientsc)
		if(err){
			result.success=false;
			result.message="添加类型失败";
			console.log(err);
			returnFn();
			}else{
			
					
							data_mg.updateTime.update({"parentKey":"type"},{$set:{"childKey":new Date().getTime()}},{},function(errB){
								if(errB){
									result.success=false;
									result.message="更新类型失败";
									console.log(errB);
								}else{
									result.success=true;
									result.code=1;
								}
								returnFn();
							})
							
						
					
				}
			
		})
	}else{
		result.success=false;
		result.code=0;
		result.message="未登录或不是管理员帐号";
		returnFn();
	}	
	
	
};

function edit(socket,data,fn){
	console.log("type/edit");

	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data);
	var result={code:0,
		time:0,
		data:[],
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("type_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.type==2){
		data_mg.type.update({"id":data.data.id},{$set:{name:data.data.name}},{},function(err){
			if(err){
				console.log(err)
				result.code=0
				result.success=false;
				result.message="修改错误";
				returnFn();
			}else{
				data_mg.updateTime.update({"parentKey":"type"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){
						result.success=false;
						result.message="更新时间出错";
						console.log(errA)
						result.code=0
					}else{
						result.success=true;
						result.code=1
					}
					returnFn()
				})
			}
		})
	}else{
		result.success=false;
		result.code=0;
		result.message="未登录或不是管理员帐号";
		returnFn();
	}
		
	
};

function remove(socket,data,fn){
	console.log("type/remove");
	//data.data = "ddgdgd"/*管理员id*/
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var result={code:0,
		time:0,
		data:[],
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("type_remove",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
	}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.type==2){
		data_mg.type.remove({"id":data.data.id},function(err){
			if(err){
				console.log(err)
				lock=0;
				result.success=false;
				result.message="删除出错";
				returnFn();
			}else{
				data_mg.updateTime.update({"parentKey":"type"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){
						result.success=false;
						result.message="更新出错";
						console.log(errA)
						result.code=0;
					}else{
						result.success=true;
						result.code=1;	
					}
					returnFn()
				})
			}
			
		});
	}else{
		result.success=false;
		result.code=0;
		result.message="未登录或不是管理员帐号";
		returnFn();
	}
		
		
};

exports.get=get;
exports.add=add;
exports.edit=edit;
exports.remove=remove;