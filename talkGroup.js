	/*创建组*/
	function addFn(cache,data,successFn,errFn){
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
			data.member.push=self.id;
			cache[data.gid]={
				id:data.gid,
				name:data.name,
				dsc:"",
				member:data.member
			};
		successFn(cache[data.gid]);
	};
	var add=new tool.factory(null,exports,modelName,"add",addFn,"user","creatTalkGroup");
	/**************************************************************/
	/*加入组*/
	function joinFn(cache,data,successFn,errFn){
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
			cache[data.gid].member.push(data.uid);
		successFn(cache[data.gid]);
	};
	var join=new tool.factory('{id:data.gid}',exports,modelName,"join",joinFn,"user","joinTalkGroup");
	/**************************************************************/
	/*退出组*/
	function outFn(cache,data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
		cache[data.gid].member=_.without(cache[data.gid].member,data.uid);
		successFn(cache[data.gid]);
	};
	var out=new tool.factory('{id:data.gid}',exports,modelName,"out",outFn,"user","outTalkGroup");
	/**************************************************************/
	/*获取组信息*/
	function getListFn(cache,data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		var returnObj={};
			_.each(data.idArry,function(point){
				if(cache[point]){
					returnObj[point]=_.pick(cache[point],"id","name","dsc","member");
				}
			});
		successFn(returnObj);
	};
	var getList=new tool.factory('{id:$in:data.idArry}',exports,modelName,"getList",getListFn);
	/**************************************************************/
	/*获取自己组信息*/
	function getMyListFn(cache,data,successFn,errFn){
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
				return _.some(point.member,self.id);
			});
			var returnObj=[];
			_.each(list,function(point){
				returnObj.push(_.pick(point,"id","name","dsc","member"));
			});
		successFn(returnObj);
	};
	var getMyList=new tool.factory('{member:{$in:[tokenArry[data.tk].user.id]}}',exports,modelName,"getMyList",getMyListFn);	