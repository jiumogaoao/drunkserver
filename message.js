	/*获取聊天记录*/
	function getListFn(cache,data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
			var returnList=[];
			_.each(cache,function(point){
				if((point.from==self.id&&point.to==data.to&&point.state==0) || (point.to==self.id&&point.from==data.to&&point.state==0)){
					if(point.from==self.id){
						point.self=true;
					}else{
						point.self=false;
					}
					returnList.push(point);
				}
			});
			returnList=_.sortBy(returnList,"time");
			returnList=_.groupBy(returnList,function(point){
				return moment(point.time,"x").format("YYYY-MM-DD");
			});
			if(returnList){
				successFn(returnList);
			}else{
				errFn("获取聊天信息出错","获取聊天信息出错");
			}
	};
	var getList=new tool.factory(exports,modelName,"getList",getListFn);
	/**************************************************************/
	/*获取组聊天记录*/
	function getGroupListFn(cache,data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
			var returnList=[];
			_.each(cache,function(point){
				if(point.to==data.to&&point.state==1){
					if(point.from==self.id){
						point.self=true;
					}else{
						point.self=false;
					}
					returnList.push(point);
				}
			});
			returnList=_.sortBy(returnList,"time");
			returnList=_.groupBy(returnList,function(point){
				return moment(point.time,"x").format("YYYY-MM-DD");
			});
			if(returnList){
				successFn(returnList);
			}else{
				errFn("获取聊天信息出错","获取聊天信息出错");
			}
	};
	var getGroupList=new tool.factory(exports,modelName,"getGroupList",getGroupListFn);
	/**************************************************************/
	/*聊天列表*/
	function getMessageListFn(cache,data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
			var returnList={};
			_.each(cache,function(point){
				if(((point.to==self.id||point.from==self.id)&&point.state==0)||((_.contains(self.group.creat,point.to)||_.contains(self.group.admin,point.to)||_.contains(self.group.member,point.to))&&point.state==1)){
					if(point.state==0){
						if(point.to==self.id){
							if(!returnList[point.from]){
								returnList[point.from]=[];
							}
							returnList[point.from].push(point);
						}else{
							if(!returnList[point.to]){
								returnList[point.to]=[];
							}
							returnList[point.to].push(point);
						}
					}else{
						if(!returnList[point.to]){
								returnList[point.to]=[];
							}
							returnList[point.to].push(point);
					}
				}
			});
			if(returnList){
				successFn(returnList);
			}else{
				errFn("获取聊天信息出错","获取聊天信息出错");
			}
	};
	var getMessageList=new tool.factory(exports,modelName,"getMessageList",getMessageListFn);
	/**************************************************************/
	/*聊天*/
	function addFn(cache,data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
			var newId=tool.uuid();
				cache[newId]={
					id:newId,
					time:new Date().getTime(),
					from:self.id,
					name:self.name,
					icon:self.icon,
					to:data.to,
					state:data.state,
					type:data.type,
					main:data.main,
					readed:false
				};
				if(data.state==0){
					tool.socket([data.to],"newMessage",cache[newId]);
				}else if(data.state==1){
					function memberGet(returnData){
						returnData=JSON.parse(returnData);
						var memberArry=[];
						_.each(returnData.data,function(point){
							_.each(point.member,function(pm){
								if(pm.id!=self.id){
									memberArry.push(pm.id)
								}
							})
						});
						tool.socket(memberArry,"newGroupMessage",cache[newId]);
					}
					server.group.getList(null,{data:{idArry:[data.to]}},memberGet);
				}
				successFn(cache[newId]);
	};
	var getMessageList=new tool.factory(exports,modelName,"add",addFn);