	/*获取空间信息*/
	function getListFn(data,successFn,errFn){
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
	var getList=new tool.factory(exports,modelName,"getList",getListFn);
	/**************************************************************/
	/*获取自己的说说*/
	function getMyListFn(data,successFn,errFn){
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
	var getMyList=new tool.factory(exports,modelName,"getMyList",getMyListFn);
	/**************************************************************/
	/*赞*/
	function praiseFn(data,successFn,errFn){
		cache[data.zid].praise.push(data.id);
		successFn(cache[data.zid]);
	};
	var praise=new tool.factory(exports,modelName,"praise",praiseFn,"user","praise");
	/**************************************************************/
	/*取消赞*/
	function cancelPraiseFn(data,successFn,errFn){
		cache[data.zid].praise=_.without(cache[data.zid].praise,data.id);
		successFn(cache[data.zid]);
	};
	var cancelPraise=new tool.factory(exports,modelName,"cancelPraise",cancelPraiseFn,"user","cancelPraise");
	/**************************************************************/
	/*关注*/
	function attentionFn(data,successFn,errFn){
		cache[data.zid].attention.push(data.id);
		successFn(cache[data.zid]);
	};
	var attention=new tool.factory(exports,modelName,"attention",attentionFn,"user","attention");
	/**************************************************************/
	/*取消关注*/
	function cancelAttentionFn(data,successFn,errFn){
		cache[data.zid].attention=_.without(cache[data.zid].attention,data.id);
		successFn(cache[data.zid]);
	};
	var cancelAttention=new tool.factory(exports,modelName,"cancelAttention",cancelAttentionFn,"user","cancelAttention");
	/**************************************************************/
	/*看了*/
	function readedFn(data,successFn,errFn){
		cache[data.zid].readed.push(data.id);
		successFn(cache[data.zid]);
	};
	var readed=new tool.factory(exports,modelName,"readed",readedFn,"user","readed");
	/**************************************************************/	
	/*分享*/
	function shareFn(data,successFn,errFn){
		cache[data.zid].share.push(data.id);
		successFn(cache[data.zid]);
	};
	var share=new tool.factory(exports,modelName,"share",shareFn,"user","share");
	/**************************************************************/
	/*回复*/
	function replyFn(data,successFn,errFn){
		cache[data.zid].reply.push({form:data.id,to:data.to,text:data.text,readed:false,time:new Date().getTime()});
		successFn(cache[data.zid]);
	};
	var reply=new tool.factory(exports,modelName,"reply",replyFn,"user","reply");
	/**************************************************************/
	/*发帖*/
	function addFn(data,successFn,errFn){
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
			successFn(cache[newId]);
	}
	var add=new tool.factory(exports,modelName,"add",addFn);
	/***************************************************************/
	/*相册照片*/
	function addAlbumPicFn(data,successFn,errFn){
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
			successFn(cache[newId]);
	}
	var addAlbumPic=new tool.factory(exports,modelName,"addAlbumPic",addAlbumPicFn,"album","addPic",true);
	/*修改个性签名*/
	function changeDscFn(data,successFn,errFn){
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
			successFn(cache[newId]);
	}
	var changeDsc=new tool.factory(exports,modelName,"changeDsc",changeDscFn,"user","changeDsc",true);