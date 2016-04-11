function get(socket,data,fn){
	console.log("message/get");
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
	 	socket.emit("message_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	//returnFn();
	//return;
	if(data.data.tk&&tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		data_mg.updateTime.find({"parentKey":"message"},function(err,doc){
			if(err){
				result.success=false;
				result.message="获取更新时间失败";
				console.log(err);
				returnFn();
			}else{
				if(doc&&doc.length&&doc[0].childKey>data.data.time){
					result.code=1;
					result.time=doc[0].childKey
					data_mg.message.$where('this.from == "'+tokenArry[data.data.tk].user.id+'" || this.to == "'+tokenArry[data.data.tk].user.id+'"').exec(function(errA,docA){
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
	}else{
				result.success=false;
				result.message="登陆信息超时,请重新登陆";
				returnFn();
				}	
};

function getAll(socket,data,fn){
	console.log("message/getAll");
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
	 	socket.emit("message_getAll",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	//returnFn();
	//return;
	if(data.data.tk&&tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.type&&tokenArry[data.data.tk].user.type==2){
		data_mg.updateTime.find({"parentKey":"message"},function(err,doc){
			if(err){
				result.success=false;
				result.message="获取更新时间失败";
				console.log(err);
				returnFn();
			}else{
				if(doc&&doc.length&&doc[0].childKey>data.data.time){
					result.code=1;
					result.time=doc[0].childKey
					data_mg.message.find({},function(errA,docA){
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
	}else{
				result.success=false;
				result.message="登陆信息超时,请重新登陆";
				returnFn();
				}	
};

function add(socket,data,fn){
	console.log("message/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
		data.data.message.id=uuid();
		
	var result={
		code:0,
		time:0,
		data:[],
		success:false,
		message:""
		};
	var returnFn=function(){
		if(socket){
	 	socket.emit("message_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	
	var newCom=new data_mg.message(data.data.message);
	newCom.save(function(err,Clientsc){
		console.log(Clientsc)
		if(err){
			result.success=false;
			result.message="添加评论失败";
			console.log(err);
			returnFn();
			}else{
			
					
							data_mg.updateTime.update({"parentKey":"message"},{$set:{"childKey":new Date().getTime()}},{},function(errB){
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
	console.log("message/edit");
if(data.data.tk&&tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.type){
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
	 	socket.emit("message_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}

	console.log("updateAdmin")
	data_mg.message.update({"from":data.data.id,"to":tokenArry[data.data.tk].user.id},{$set:{readed:true}},{},function(err){
		if(err){
			console.log(err)
			result.code=0
			returnFn()
		}else{
			console.log("updateTime")
			data_mg.updateTime.update({"parentKey":"message"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
				if(errA){
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
				result.message="登陆信息超时,请重新登陆";
				returnFn();
				}	
};

function remove(socket,data,fn){
	console.log("message/remove");
	//data.data = "ddgdgd"/*管理员id*/
	console.log(data.data);
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("message_remove",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
	}
	console.log("删除admin")
	data_mg.message.remove({"id":data.data},function(err){
		if(err){
			console.log(err)
			result.code=0
			returnFn()
		}else{
			console.log("更新admin")
			data_mg.updateTime.update({"parentKey":"message"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
				if(errA){
					console.log(errA)
					result.code=0;
					returnFn()
				}else{
					console.log("删除client")
					data_mg.message.remove({"id":data.data},function(errB){
						if(errB){
							console.log(errB)
							result.code=0
							returnFn()
							}else{
								console.log("跟新client")
								data_mg.updateTime.update({"parentKey":"message"},{$set:{"childKey":new Date().getTime()}},{},function(errC){
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
exports.getAll=getAll;
exports.add=add;
exports.edit=edit;
exports.remove=remove;