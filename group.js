
	var cache={};
	var db={};
	var inited=false;
	var initEnd=function(){
		cache=db.data||{};
		inited=true;
		var save=setInterval(function(){
			data_mg.update({id:modelName},{$set:{data:cache}},function(err,doc){
				if(err){
				console.log(err)	
				}
			});
		},5000);
	}
	var modelName=_.last(__filename.split("\\")).split(".")[0];
	var get=function(){
		if(!inited){/*没初始，先初始*/
			data_mg.findOne({id:modelName},function(err,doc){
				if(err||!doc){
					db=new data_mg({id:modelName,data:{}});
					db.save(function(err){
						if(err){
							console.log(err);
						}else{
							initEnd();
						}
					});
				}else{
					db=doc;
					initEnd();
				}
			})
				};
	}
	get();
	/**************************************************************/
	/*创建组*/
	function addFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		if(!data.gid){
				data.gid=tool.uuid();
			}
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
			var self=tokenArry[data.tk].user;
			cache[data.gid]={
				id:data.gid,
				name:data.name,
				dsc:"",
				icon:data.icon,
				type:0,
				file:[],
				album:[],
				publics:"",
				action:[],
				sign:[],
				vote:[],
				link:"",
				app:[],
				member:[{id:self.id,nickName:"",type:"owner"}]
			};
		successFn(cache[data.gid]);
	};
	var add=new tool.factory(exports,modelName,"add",addFn,"user","creatGroup");
	/**************************************************************/
	/*加入组*/
	function joinFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		if(!data.gid){
				data.gid=tool.uuid();
			}
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
			var self=tokenArry[data.tk].user;
			if(!data.uid){
				data.uid=self.id
			}
			cache[data.gid].member.push({id:data.uid,nickName:"",type:"owner"});
		successFn(cache[data.gid]);
	};
	var join=new tool.factory(exports,modelName,"join",joinFn,"user","joinGroup");
	/**************************************************************/
	/*退出组*/
	function outFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
		cache[data.gid].member=_.reject(cache[data.gid].member,{id:data.uid});
		successFn(cache[data.gid]);
	};
	var out=new tool.factory(exports,modelName,"out",outFn,"user","outGroup");
	/**************************************************************/
	/*添加管理员*/
	function addAdminFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var returnObj=_.findWhere(cache[data.gid].member,{id:data.uid});
			returnObj.type="admin";
		successFn(returnObj);
	};
	var addAdmin=new tool.factory(exports,modelName,"addAdmin",addAdminFn,"user","addAdminGroup");
	/**************************************************************/
	/*去除管理员*/
	function cancelAdminFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var returnObj=_.findWhere(cache[data.gid].member,{id:data.uid});
			returnObj.type="member";
		successFn(returnObj);
	};
	var cancelAdmin=new tool.factory(exports,modelName,"cancelAdmin",cancelAdminFn,"user","cancelAdminGroup");
	/**************************************************************/
	/*搜索没进的组*/
	function searchNotGroupFn(data,successFn,errFn){
		var self=tokenArry[data.tk].user;
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var returnList=_.reject(cache, function(point){
			 return _.some(point.member,{id:self.id}); 
			});
		successFn(returnList);
	};
	var searchNotGroup=new tool.factory(exports,modelName,"searchNotGroup",searchNotGroupFn);
	/**************************************************************/
	/*获取组信息*/
	function getListFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		var returnObj={};
			_.each(data.idArry,function(point){
				if(cache[point]){
					returnObj[point]=_.pick(cache[point],"id","name","dsc","type","icon","member");
				}
			});
		successFn(returnObj);
	};
	var getList=new tool.factory(exports,modelName,"getList",getListFn);
	/**************************************************************/
	/*获取自己组信息*/
	function getMyListFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
			var list=_.filter(cache,function(point){
				return _.some(point.member,{id:self.id});
			});
			var returnObj=[];
			_.each(list,function(point){
				returnObj.push(_.pick(point,"id","name","dsc","type","icon","member"));
			});
			returnObj=_.groupBy(returnObj,function(point){
				return _.findWhere(point.member,{id:self.id}).type;
			});
		successFn(returnObj);
	};
	var getMyList=new tool.factory(exports,modelName,"getMyList",getMyListFn);	