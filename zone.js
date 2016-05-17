var modelName=_.last(__filename.split("\\")).split(".")[0];
	/*获取空间信息*/
	function getListFn(cache,data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
			var returnList=_.filter(cache,function(point){
				return (point.user==self.id||_.some(self.friend.checked,function(friendPoind){
					return friendPoind.id==point.user
				}))
			});
			if(returnList){
				returnList=_.sortBy(returnList,function(point){
					return -1*point.time
				});
				successFn(returnList);
			}else{
				errFn("获取空间信息出错","获取空间信息出错");
			}
	};
	var getList=new tool.factory('{$or:[{user:tokenArry[data.tk].user.id},{user:{$in:tokenArry[data.tk].user.friend.checked}}]}',exports,modelName,"getList",getListFn);
	/**************************************************************/
	/*获取自己的说说*/
	function getMyListFn(cache,data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
			var returnList=_.filter(cache,function(point){
				return point.user==self.id
			});
			if(returnList){
				returnList=_.sortBy(returnList,function(point){
					return -1*point.time
				});
				successFn(returnList);
			}else{
				errFn("获取空间信息出错","获取空间信息出错");
			}
	};
	var getMyList=new tool.factory('{user:tokenArry[data.tk].user.id}',exports,modelName,"getMyList",getMyListFn);
	/**************************************************************/
	/*赞*/
	function praiseFn(cache,data,successFn,errFn){
		cache[data.zid].praise.push(data.id);
		successFn(cache[data.zid],cache);
	};
	var praise=new tool.factory('{id:data.zid}',exports,modelName,"praise",praiseFn,"user","praise");
	/**************************************************************/
	/*取消赞*/
	function cancelPraiseFn(cache,data,successFn,errFn){
		cache[data.zid].praise=_.without(cache[data.zid].praise,data.id);
		successFn(cache[data.zid],cache);
	};
	var cancelPraise=new tool.factory('{id:data.zid}',exports,modelName,"cancelPraise",cancelPraiseFn,"user","cancelPraise");
	/**************************************************************/
	/*关注*/
	function attentionFn(cache,data,successFn,errFn){
		cache[data.zid].attention.push(data.id);
		successFn(cache[data.zid],cache);
	};
	var attention=new tool.factory('{id:data.zid}',exports,modelName,"attention",attentionFn,"user","attention");
	/**************************************************************/
	/*取消关注*/
	function cancelAttentionFn(cache,data,successFn,errFn){
		cache[data.zid].attention=_.without(cache[data.zid].attention,data.id);
		successFn(cache[data.zid],cache);
	};
	var cancelAttention=new tool.factory('{id:data.zid}',exports,modelName,"cancelAttention",cancelAttentionFn,"user","cancelAttention");
	/**************************************************************/
	/*看了*/
	function readedFn(cache,data,successFn,errFn){
		cache[data.zid].readed.push(data.id);
		successFn(cache[data.zid],cache);
	};
	var readed=new tool.factory('{id:data.zid}',exports,modelName,"readed",readedFn,"user","readed");
	/**************************************************************/	
	/*分享*/
	function shareFn(cache,data,successFn,errFn){
		cache[data.zid].share.push(data.id);
		successFn(cache[data.zid],cache);
	};
	var share=new tool.factory('{id:data.zid}',exports,modelName,"share",shareFn,"user","share");
	/**************************************************************/
	/*回复*/
	function replyFn(cache,data,successFn,errFn){
		cache[data.zid].reply.push({form:data.id,to:data.to,text:data.text,readed:false,time:new Date().getTime()});
		successFn(cache[data.zid],cache);
	};
	var reply=new tool.factory('{id:data.zid}',exports,modelName,"reply",replyFn,"user","reply");
	/**************************************************************/
	/*发帖*/
	function addFn(cache,data,successFn,errFn){
		var self=tokenArry[data.tk].user;
			var newId=tool.uuid();
				cache[newId]={
					id:newId,
					type:0,
					time:new Date().getTime(),
					icon:self.icon,
					name:self.name,
					user:self.id,
					text:data.text,
					pic:data.pic,
					praise:[],
					attention:[],
					readed:[],
					share:[],
					reply:[]	
				};
			var memberArry=_.pluck(self.friend.checked,"id");
			tool.socket(memberArry,"newZone",cache[newId]);
			successFn(cache[newId],cache);
	}
	var add=new tool.factory(null,exports,modelName,"add",addFn);
	/***************************************************************/
	/*相册照片*/
	function addAlbumPicFn(cache,data,successFn,errFn){
		var self=tokenArry[data.tk].user;
			var newId=tool.uuid();
				cache[newId]={
					id:newId,
					type:1,
					time:new Date().getTime(),
					icon:self.icon,
					name:self.name,
					user:self.id,
					text:"",
					pic:[{id:tool.uuid(),src:data.src}],
					praise:[],
					attention:[],
					readed:[],
					share:[],
					reply:[]	
				};
			var memberArry=_.pluck(self.friend.checked,"id");
			tool.socket(memberArry,"newZone",cache[newId]);
			successFn(cache[newId],cache);
	}
	var addAlbumPic=new tool.factory(null,exports,modelName,"addAlbumPic",addAlbumPicFn,"album","addPic",true);
	/*修改个性签名*/
	function changeDscFn(cache,data,successFn,errFn){
		var self=tokenArry[data.tk].user;
			var newId=tool.uuid();
				cache[newId]={
					id:newId,
					type:2,
					time:new Date().getTime(),
					icon:self.icon,
					name:self.name,
					user:self.id,
					text:data.dsc,
					pic:[],
					praise:[],
					attention:[],
					readed:[],
					share:[],
					reply:[]	
				};
			var memberArry=_.pluck(self.friend.checked,"id");
			tool.socket(memberArry,"newZone",cache[newId]);
			successFn(cache[newId],cache);
	}
	var changeDsc=new tool.factory(null,exports,modelName,"changeDsc",changeDscFn,"user","changeDsc",true);