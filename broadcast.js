function get(socket,data,fn){
	console.log("broadcast/get");
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
	 	socket.emit("broadcast_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	//returnFn();
	//return;
	data_mg.updateTime.find({"parentKey":"broadcast"},function(err,doc){
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
				data_mg.broadcast.find({},function(errA,docA){
					if(errA){
						result.success=false;
						result.message="获取评论列表失败";
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
	console.log("broadcast/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
		data.data.id=uuid();
		
	var result={
		code:0,
		time:0,
		data:[],
		success:false,
		message:""
		};
	var returnFn=function(){
		if(socket){
	 	socket.emit("broadcast_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	
	var newCom=new data_mg.broadcast(data.data);
	newCom.save(function(err,Clientsc){
		console.log(Clientsc)
		if(err){
			result.success=false;
			result.message="添加评论失败";
			console.log(err);
			returnFn();
			}else{
			
					
							data_mg.updateTime.update({"parentKey":"broadcast"},{$set:{"childKey":new Date().getTime()}},{},function(errB){
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
	console.log("broadcast/edit");

	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data);
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("broadcast_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	console.log("updateAdmin")
	data_mg.broadcast.update({"id":data.data.id},{$set:data.data},{},function(err){
		if(err){
			console.log(err)
			result.code=0
			returnFn()
		}else{
			console.log("updateTime")
			data_mg.updateTime.update({"parentKey":"broadcast"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
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
	console.log("broadcast/remove");
	//data.data = "ddgdgd"/*管理员id*/
	console.log(data.data);
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("broadcast_remove",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
	}
	console.log("删除admin")
	data_mg.broadcast.remove({"id":data.data},function(err){
		if(err){
			console.log(err)
			result.code=0
			returnFn()
		}else{
			console.log("更新admin")
			data_mg.updateTime.update({"parentKey":"broadcast"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
				if(errA){
					console.log(errA)
					result.code=0;
					returnFn()
				}else{
					console.log("删除client")
					data_mg.broadcast.remove({"id":data.data},function(errB){
						if(errB){
							console.log(errB)
							result.code=0
							returnFn()
							}else{
								console.log("跟新client")
								data_mg.updateTime.update({"parentKey":"broadcast"},{$set:{"childKey":new Date().getTime()}},{},function(errC){
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