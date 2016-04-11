function get(socket,data,fn){
	console.log("realName/get");
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
	 	socket.emit("realName_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	//returnFn();
	//return;
	data_mg.updateTime.find({"parentKey":"realName"},function(err,doc){
		if(err){
			result.success=false;
			result.message="获取更新时间失败";
			console.log(err);
			returnFn();
		}else{
			console.log(doc)
			if(doc&&doc.length&&doc[0].childKey>data.data.time){
				result.code=1;
				result.time=doc[0].childKey
				data_mg.realName.find({},function(errA,docA){
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
				result.success=true;
				result.code=2;
				returnFn();
			}
		}
	})
	
};

function add(socket,data,fn){
	console.log("realName/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var adminData = {
		"id":uuid(),/*id*/
		"name":data.data.name/*项目名*/
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
	 	socket.emit("realName_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	
	var newObj=new data_mg.realName(adminData);
	newObj.save(function(err,Clientsc){
		console.log(Clientsc)
		if(err){
			result.success=false;
			result.message="添加项目";
			console.log(err);
			returnFn();
			}else{
			
					
							data_mg.updateTime.update({"parentKey":"realName"},{$set:{"childKey":new Date().getTime()}},{},function(errB){
								if(errB){
									result.success=false;
									result.message="更新项目失败";
									console.log(errB);
								}else{
									result.success=true;
									result.code=1;
								}
								returnFn();
							})
							
						
					
				}
			
		})
	
};

function edit(socket,data,fn){
	console.log("obj/edit");

	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data);
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("obj_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	console.log("updateAdmin")
	data_mg.admin.update({"id":data.data.id},{$set:data.data},{},function(err){
		if(err){
			console.log(err)
			result.code=0
			returnFn()
		}else{
			console.log("updateTime")
			data_mg.updateTime.update({"parentKey":"admin"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
				if(errA){
					console.log(errA)
					result.code=0
				}else{
					result.code=1
				}
				returnFn()
			})
		}
	})
	
};

function remove(socket,data,fn){
	console.log("obj/remove");
	//data.data = "ddgdgd"/*管理员id*/
	console.log(data.data);
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("obj_remove",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
	}
	console.log("删除admin")
	data_mg.admin.remove({"id":data.data},function(err){
		if(err){
			console.log(err)
			result.code=0
			returnFn()
		}else{
			console.log("更新admin")
			data_mg.updateTime.update({"parentKey":"admin"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
				if(errA){
					console.log(errA)
					result.code=0;
					returnFn()
				}else{
					console.log("删除client")
					data_mg.client.remove({"id":data.data},function(errB){
						if(errB){
							console.log(errB)
							result.code=0
							returnFn()
							}else{
								console.log("跟新client")
								data_mg.updateTime.update({"parentKey":"client"},{$set:{"childKey":new Date().getTime()}},{},function(errC){
								if(errC){
							console.log(errC)
							result.code=0}else{
								result.code=1
								}
								returnFn()	
									})
								}
						})

				}

			})
		}
	})
		
};

exports.get=get;
exports.add=add;
exports.edit=edit;
exports.remove=remove;