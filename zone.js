
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
	/*获取聊天记录*/
	function getListFn(data,successFn,errFn){
		var self=tokenArry[data.tk];
			var returnList=_.filter(cache,function(point){
				return (point.user==self.id||_.some(self.friend.checked,function(friendPoind){
					return friendPoind.id==point.user
				}))
			});
			if(returnList){
				successFn(returnList);
			}else{
				errFn("获取空间信息出错","获取空间信息出错");
			}
	};
	var getList=new tool.factory(exports,modelName,"getList",getListFn);
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
		var self=tokenArry[data.tk];
			var newId=tool.uuid();
				cache[newId]={
					id:newId,
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
			successFn(cache[newId]);
	}
	var add=new tool.factory(exports,modelName,"add",addFn);