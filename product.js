function get(socket,data,fn){
	console.log("product/get");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	//data.data = 10086/*不用传*/
	var result={
		code:0,
		time:0,
		data:{},
		success:false,
		message:""
		};
	var returnFn=function(){
		if(socket){
	 	socket.emit("product_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	data_mg.updateTime.find({"parentKey":"product"},function(err,doc){
		if(err){
			console.log(err);
			result.success=false;
			result.message="查询更新时间失败";
			returnFn()
			}else{
				if(doc&&doc.length&&doc[0].childKey>data.data.time){
					result.time=doc[0].childKey;
					data_mg.product.find({},function(errA,docA){
						if(errA){
							console.log(errA)
							result.success=false;
							result.message="获取产品商品信息失败";
							}else{
								result.success=true;
								result.code=1;
								result.data=docA
								}
							returnFn()
						})
					}else{
						result.success=true;
						result.code=0;
						returnFn()
						}
				}
		})
		
};
/******************************************************************************************/
function add(socket,data,fn){
	console.log("product/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={
		success:false,
		code:0,
		message:"",
		data:{},
		time:0
		};
	var returnFn=function(){
		if(socket){
	 	socket.emit("product_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&(tokenArry[data.data.tk].user.type==2||tokenArry[data.data.tk].user.type==3)){
		data.data.id=uuid();
		data.data.member=[];
		data.data.shopId=tokenArry[data.data.tk].user.id;
		data.data.star=0;
		data.data.visit=0;
		data.data.state="0";
		var newProduct=new data_mg.product(data.data);
	newProduct.save(function(err){
		if(err){console.log(err)
			result.success=false;
			result.message="创建商品失败";
			returnFn()
			}else{console.log("更新时间");
				var lastTime=new Date().getTime();
				data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":lastTime}},{},function(errA){
					if(errA){console.log(errA)
						result.success=false;
						result.message="更新产品时间失败";
						}else{
							result.time=lastTime;
							result.success=true;
							result.code=1;
							result.data={"id":data.data.id};
							}
							console.log(result);
						returnFn()
					})
				}
		})
		}else{
		result.success=false;
				result.message="登陆信息超时,或不是管理员帐号";
				returnFn();
		}
	
		
};
/**************************************************************************************/
function edit(socket,data,fn){
	console.log("product/edit");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("product_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&(tokenArry[data.data.tk].user.type==2||tokenArry[data.data.tk].user.type==3)){
			console.log("更新产品")
			var editId=data.data.id;
			delete data.data.id
			delete data.data.member
			delete data.data.shopId
			delete data.data.star;
			data.data.state="0";
			data.data.visit=0;
	data_mg.product.update({"id":editId},{$set:data.data},{},function(err){
		if(err){console.log(err)
			result.success=false;
			result.message="修改产品失败";
			returnFn()
			}else{console.log("更新时间")
				data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){console.log(errA)
						result.success=false;
			result.message="更新产品失败";
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
				result.message="登陆信息超时,或不是管理员帐号";
				returnFn();
		}	
	
		
};
/**************************************************************************************/
function pass(socket,data,fn){
	console.log("product/pass");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("product_pass",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&(tokenArry[data.data.tk].user.type==2)){
			console.log("更新产品")
	data_mg.product.update({"id":data.data.id},{$set:{"state":data.data.state}},{},function(err){
		if(err){console.log(err)
			result.success=false;
			result.message="修改产品失败";
			returnFn()
			}else{console.log("更新时间")
				data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){console.log(errA)
						result.success=false;
			result.message="更新产品失败";
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
				result.message="登陆信息超时,或不是管理员帐号";
				returnFn();
		}	
	
		
};
/**************************************************************************************/
function visit(socket,data,fn){
	console.log("product/visit");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("product_visit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	
	if(tokenArry[data.data.tk]){
			console.log("更新产品")
	data_mg.product.update({"id":data.data.id},{$inc:{"visit":1}},{},function(err){
		if(err){console.log(err)
			result.success=false;
			result.message="修改产品失败";
			returnFn()
			}else{console.log("更新时间")
				data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){console.log(errA)
						result.success=false;
			result.message="更新产品失败";
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
				result.message="登陆信息超时,或不是管理员帐号";
				returnFn();
		}	
	
		
};
/*********************************************************************************************/
function remove(socket,data,fn){
	console.log("product/remove");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("product_remove",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
		}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&(tokenArry[data.data.tk].user.type==2||tokenArry[data.data.tk].user.type==3)){
	var lock=1;
	var callbackCount=0;
	var errSend=1;
	function callback(){
			if(lock){
				callbackCount++;
				if(callbackCount==data.data.list.length){
					if(lock){
						data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){
						console.log(errA)
						result.success=false;
						result.message="更新时间失败";
						}else{
							result.success=true;
							}
						returnFn()
					})
						}
					}
				}else{
					if(errSend){
						errSend=0;
					returnFn();
						}
					}
				
		}
		for (var i=0;i<data.data.list.length;i++){
			if(lock){
				data_mg.product.findOne({"id":data.data.list[i]},function(errB,doc){
			if(errB){
				result.success=false;
				result.message="没有该产品";
				lock=0;
				callback();
				}else{
					if(doc.payedMoney!=0){
						result.success=false;
						result.message="该产品金额不为0,无法删除";
						lock=0;
						callback();
						}else{
							data_mg.product.remove({"id":data.data.list[i]},function(err){
		if(err){
			console.log(err)
			result.success=false;
			result.message="删除失败";
			lock=0;
			callback();
			}else{
				callback();}
		});
							}
					}
			});
				}
			
			}
		
		
				
				
		}else{
		result.success=false;
				result.message="登陆信息超时,或不是管理员帐号";
				returnFn();
		}
	
	
};
/*********************************************************************/
function detail(socket,data,fn){
	console.log("product/detail");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	//data.data = 10086/*不用传*/
	var result={
		code:0,
		time:0,
		data:{},
		success:false,
		message:""
		};
	var returnFn=function(){
		if(socket){
	 	socket.emit("product_detail",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	data_mg.product.findOne({id:data.data.id},function(err,doc){console.log(doc)
						if(err){
							console.log(err)
							result.success=false;
							result.message="获取产品商品信息失败";
							returnFn();
							}else{
								if(doc){
									data_mg.com.find({productId:data.data.id},function(errA,docA){
										if(errA){
											console.log(errA)
											result.success=false;
											result.message="获取评论失败";
											returnFn();
										}else{
											doc.com=docA;
											data_mg.deal.find({productId:data.data.id},function(errB,docB){
												if(errB){
													console.log(errB)
													result.success=false;
													result.message="获取交易名单失败";
												}else{
													doc.member=docB;
													result.success=true;
													result.data=doc;
													result.code=1;
												}
												returnFn();
											})
										}
									})
								}else{
									reuslt.success=false;
									result.message="没有该产品"
									returnFn();
								}
								}
							
						})
		
};
exports.detail=detail;
exports.get=get;
exports.add=add;
exports.edit=edit;
exports.pass=pass;
exports.remove=remove;
exports.visit=visit;