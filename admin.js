function get(socket,data,fn){
	console.log("admin/get");
	console.log(data.data)
	var result={
					code:0,
					time:0,
					data:[]
					};
	var returnFn=function(){
		if(socket){
	 	socket.emit("admin_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	//returnFn();
	//return;
	data_mg.updateTime.find({"parentKey":"admin"},function(err,doc){
		if(err){
			result.code=0;
			returnFn();
		}else{
			console.log(doc)
			if(doc&&doc.length&&doc[0].childKey>data.data){
				result.time=doc[0].childKey
				data_mg.admin.find({},function(errA,docA){
					if(errA){
						result.code=0
					}else{
						result.code=1;
						result.data=docA;
					}
					returnFn();
				});
			}else{
				result.code=2;
				returnFn();
			}
		}
	})
	
};

function add(socket,data,fn){
	console.log("admin/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	data.data.password="123456"
	var adminData = {
		"id":data.data.id,/*id*/
		"userName":data.data.userName,/*帐号*/
		"client":"0",/*用户管理*/
		"admin":"0",/*管理员管理*/
		"announcement":"0",/*公告管理*/
		"recruit":"0",/*招聘管理*/
		"company":"0",/*企业信息管理*/
		"product":"0",/*商品管理*/
		"promotion":"0",/*宣传管理*/
		"redPacket":"0"/*红包管理*/
		}
		
	var result={code:0,message:"",data:{}};
	var returnFn=function(){
		if(socket){
	 	socket.emit("admin_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	
	var newClient=new data_mg.client(data.data)
	newClient.save(function(err,Clientsc){
		console.log(Clientsc)
		if(err){
			result.code=0;
			result.message="添加用户";
			console.log(err);
			returnFn();
			}else{
				var newPassword=new data_mg.client_password({
					"parentKey":data.data.id,
					"childKey":data.data.password,
					})
				newPassword.save(function(errA,Passsc){
					console.log(Passsc)
					if(errA){
						result.code=0;
						result.message="添加密码失败";
						console.log(errA);
						returnFn();
						}else{
							data_mg.updateTime.update({"parentKey":"client"},{$set:{"childKey":new Date().getTime()}},{},function(errB){
								if(errB){
									result.code=0;
									result.message="更新用户失败";
									console.log(errB);
									returnFn();
								}else{
									/*******************************/
									var newAdmin=new data_mg.admin(adminData);
									
									newAdmin.save(function(err){
										if(err){
											result.code=0;
											result.message="添加管理员失败";
											console.log(err);
											returnFn();
										}else{
											data_mg.updateTime.update({"parentKey":"admin"},{$set:{"childKey":new Date().getTime()}},{},function(errC){
												if(errC){
													result.code=0
													result.message="更新管理员失败";
													console.log(errC)
												}else{
													result.code=1
												}
												returnFn()
											})
										}
									});
									/*******************************/
								}
								
							})
							}
						
					})
				}
			
		})
	
};

function edit(socket,data,fn){
	console.log("admin/edit");

	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data);
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("admin_edit",result);
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
	console.log("admin/remove");
	//data.data = "ddgdgd"/*管理员id*/
	console.log(data.data);
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("admin_remove",result);
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