function get(socket,data,fn){
	console.log("borrow/get");
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
	 	socket.emit("borrow_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	//returnFn();
	//return;
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		data_mg.updateTime.find({"parentKey":"borrow"},function(err,doc){
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
				data_mg.borrow.find({user:tokenArry[data.data.tk].user.id},function(errA,docA){
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
	}else{
		result.success=false;
		result.code=0;
		result.message="未登录或账号状态有误";
		returnFn();
	}	
};

function getSuccee(socket,data,fn){
	console.log("borrow/getSuccee");
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
	 	socket.emit("borrow_getSuccee",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	//returnFn();
	//return;

		data_mg.updateTime.find({"parentKey":"borrow"},function(err,doc){
		if(err){
			result.success=false;
			result.message="获取更新时间失败";
			console.log(err);
			returnFn();
		}else{
			if(doc&&doc.length&&doc[0].childKey>data.data.time){
				result.code=1;
				result.time=doc[0].childKey
				data_mg.borrow.find({state:2},function(errA,docA){
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

function getList(socket,data,fn){
	console.log("borrow/getList");
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
	 	socket.emit("borrow_getList",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	//returnFn();
	//return;
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.type==2){
		data_mg.updateTime.find({"parentKey":"borrow"},function(err,doc){
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
				data_mg.borrow.find({},function(errA,docA){
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
	}else{
		result.success=false;
		result.code=0;
		result.message="未登录或账号状态有误";
		returnFn();
	}	
};

function add(socket,data,fn){
	console.log("borrow/add");
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
	 	socket.emit("borrow_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		var adminData = {
		"id":uuid(),/*id*/
		"user":tokenArry[data.data.tk].user.id,/*用户id*/
		"image":tokenArry[data.data.tk].user.image,
		"linkMan":data.data.linkMan||"",/*联系人*/
		"birthday":data.data.birthday||0,/*生日*/
		"workPlace":data.data.workPlace||"",/*工作地点*/
		"census":data.data.census||"",/*户籍*/
		"pay":data.data.pay||0,/*月薪*/
		"house":data.data.house||"0",/*房贷*/
		"car":data.data.car||"0",/*车贷*/
		"card":data.data.card||"0",/*身份证号*/
		"phone":data.data.phone||"",/*联系手机*/
		"money":data.data.money||0,/*借款金额*/
		"state":0/*状态*/
		}
		var newBorrow=new data_mg.borrow(adminData);
	newBorrow.save(function(err,Clientsc){
		console.log(Clientsc)
		if(err){
			result.success=false;
			result.message="添加借贷失败";
			console.log(err);
			returnFn();
			}else{
			
					
							data_mg.updateTime.update({"parentKey":"borrow"},{$set:{"childKey":new Date().getTime()}},{},function(errB){
								if(errB){
									result.success=false;
									result.message="更新借贷失败";
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
		result.message="未登录或账号状态有误";
		returnFn();
	}	
	
	
};

function edit(socket,data,fn){
	console.log("borrow/edit");

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
	 	socket.emit("borrow_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		data_mg.borrow.findOne({"id":data.data.id,"user":tokenArry[data.data.tk].user.id},function(err,borrow){
			if(err||!borrow){
				console.log(err)
				result.code=0
				result.success=false;
				result.message="没有该借贷";
				returnFn();
			}else if(borrow.state){
				console.log(err)
				result.code=0
				result.success=false;
				result.message="该借贷已受理，无法更改";
				returnFn();
			}else{
				var newData={
			"linkMan":data.data.linkMan||"",/*联系人*/
			"birthday":data.data.birthday||0,/*生日*/
			"workPlace":data.data.workPlace||"",/*工作地点*/
			"census":data.data.census||"",/*户籍*/
			"pay":data.data.pay||0,/*月薪*/
			"house":data.data.house||"0",/*房贷*/
			"car":data.data.car||"0",/*车贷*/
			"card":data.data.card||"0",/*身份证号*/
			"phone":data.data.phone||"",/*联系手机*/
			"money":data.data.money||0/*借款金额*/
		}
		data_mg.borrow.update({"id":data.data.id,"user":tokenArry[data.data.tk].user.id},{$set:newData},{},function(err){
			if(err){
				console.log(err)
				result.code=0
				result.success=false;
				result.message="修改错误";
				returnFn();
			}else{
				data_mg.updateTime.update({"parentKey":"borrow"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
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
			}
		})
		
	}else{
		result.success=false;
		result.code=0;
		result.message="未登录或不是管理员帐号";
		returnFn();
	}
		
	
};

function editState(socket,data,fn){
	console.log("borrow/editState");

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
	 	socket.emit("borrow_editState",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.type==2){
		data_mg.borrow.update({"id":data.data.id},{$set:{state:data.data.state}},{},function(err){
			if(err){
				console.log(err)
				result.code=0
				result.success=false;
				result.message="修改错误";
				returnFn();
			}else{
				data_mg.updateTime.update({"parentKey":"borrow"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
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

exports.get=get;
exports.add=add;
exports.edit=edit;
exports.editState=editState;
exports.getList=getList;
exports.getSuccee=getSuccee;