function get(socket,data,fn){
	console.log("obj/get");
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
	 	socket.emit("obj_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	//returnFn();
	//return;
	data_mg.updateTime.find({"parentKey":"obj"},function(err,doc){
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
				data_mg.obj.find({},function(errA,docA){
					if(errA){
						result.success=false;
						result.message="获取项目列表失败";
						console.log(errA);
					}else{
						result.success=true;
						result.data=docA[0].list;
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

function edit(socket,data,fn){
	console.log("obj/edit");

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
	 	socket.emit("obj_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.type==2){
		var sendData={}
		if(data.data.name){
			sendData.name=data.data.name;
		}
		if(data.data.parentId){
			sendData.parentId=data.data.parentId;
		}
		data_mg.obj.update({},{$set:{list:data.data.obj}},{},function(err){
			if(err){
				console.log(err)
				result.code=0
				result.success=false;
				result.message="修改错误";
				returnFn();
			}else{
				data_mg.updateTime.update({"parentKey":"obj"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){
						result.success=false;
						result.message="更新时间出错";
						console.log(errA)
						result.code=0;
						returnFn();
					}else{
						data_mg.promotion.find({},function(errPomo,pomoArry){
							if(errPomo){
								console.log(errPomo);
								result.success=false;
								result.message="获取广告信息失败";
								returnFn();
							}else{

								var pomo=pomoArry[0].any;
								var newPomo={
									"001":pomo["001"],
									"002":pomo["002"],
									"003":pomo["003"],
									"004":pomo["004"]
								}
								for (var i=0;i<data.data.obj.length;i++){
									if(data.data.obj[i].parentId=="all"){
										if(pomo[data.data.obj[i].id+"_A"]){
											newPomo[data.data.obj[i].id+"_A"]=pomo[data.data.obj[i].id+"_A"];
										}else{
											newPomo[data.data.obj[i].id+"_A"]={"id":data.data.obj[i].id+"_A","name":data.data.obj[i].name+"品牌","list":{}}
										}
										if(pomo[data.data.obj[i].id+"_B"]){
											newPomo[data.data.obj[i].id+"_B"]=pomo[data.data.obj[i].id+"_B"];
										}else{
											newPomo[data.data.obj[i].id+"_B"]={"id":data.data.obj[i].id+"_B","name":data.data.obj[i].name+"推广","list":{}}
										}
										if(pomo[data.data.obj[i].id+"_C"]){
											newPomo[data.data.obj[i].id+"_C"]=pomo[data.data.obj[i].id+"_C"];
										}else{
											newPomo[data.data.obj[i].id+"_C"]={"id":data.data.obj[i].id+"_C","name":data.data.obj[i].name+"大图","list":{}}
										}
									}
								}
								data_mg.promotion.update({},{$set:{"any":newPomo}},{},function(e){
									if(e){
										console.log(e);
										result.success=false;
										result.message="修改广告信息失败";
										returnFn();
									}else{
										data_mg.updateTime.update({"parentKey":"promotion"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
											if(errA){
												result.success=false;
												result.message="更新时间出错";
												console.log(errA)
												result.code=0;
												
											}else{
												result.success=true;
												result.code=1;
											}
											returnFn();
										});
										
									}
									
								})
							}
						});
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

exports.get=get;
exports.edit=edit;