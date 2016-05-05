var modelName=_.last(__filename.split("\\")).split(".")[0];
	/*创建组*/
	function addFn(cache,data,successFn,errFn){
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
	var add=new tool.factory(null,exports,modelName,"add",addFn,"user","creatGroup");
	/**************************************************************/
	/*加入组*/
	function joinFn(cache,data,successFn,errFn){
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
	var join=new tool.factory('{id:data.gid}',exports,modelName,"join",joinFn,"user","joinGroup");
	/**************************************************************/
	/*退出组*/
	function outFn(cache,data,successFn,errFn){
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
		cache[data.gid].member=_.reject(cache[data.gid].member,{id:data.uid});
		successFn(cache[data.gid]);
	};
	var out=new tool.factory('{id:data.gid}',exports,modelName,"out",outFn,"user","outGroup");
	/**************************************************************/
	/*添加管理员*/
	function addAdminFn(cache,data,successFn,errFn){
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var returnObj=_.findWhere(cache[data.gid].member,{id:data.uid});
			returnObj.type="admin";
		successFn(returnObj);
	};
	var addAdmin=new tool.factory('{id:data.gid}',exports,modelName,"addAdmin",addAdminFn,"user","addAdminGroup");
	/**************************************************************/
	/*去除管理员*/
	function cancelAdminFn(cache,data,successFn,errFn){
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var returnObj=_.findWhere(cache[data.gid].member,{id:data.uid});
			returnObj.type="member";
		successFn(returnObj);
	};
	var cancelAdmin=new tool.factory('{id:data.gid}',exports,modelName,"cancelAdmin",cancelAdminFn,"user","cancelAdminGroup");
	/**************************************************************/
	/*搜索没进的组*/
	function searchNotGroupFn(cache,data,successFn,errFn){
		var self=tokenArry[data.tk].user;
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var returnList=_.reject(cache, function(point){
			 return _.some(point.member,{id:self.id}); 
			});
		successFn(returnList);
	};
	var searchNotGroup=new tool.factory('{member:{id:{$nin:[self.id]}}}',exports,modelName,"searchNotGroup",searchNotGroupFn);
	/**************************************************************/
	/*获取组信息*/
	function getListFn(cache,data,successFn,errFn){
		var returnObj={};
			_.each(data.idArry,function(point){
				if(cache[point]){
					returnObj[point]=_.pick(cache[point],"id","name","dsc","type","icon","member");
				}
			});
		successFn(returnObj);
	};
	var getList=new tool.factory('{id:{$in:data.idArry}}',exports,modelName,"getList",getListFn);
	/**************************************************************/
	/*获取自己组信息*/
	function getMyListFn(cache,data,successFn,errFn){
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
	var getMyList=new tool.factory('{id:tokenArry[data.tk].user.id}',exports,modelName,"getMyList",getMyListFn);	