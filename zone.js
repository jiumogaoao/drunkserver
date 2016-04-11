
	var cache={};
	var db={};
	var inited=false;
	var initEnd=function(){
		cache=db.data;
		inited=true;
		var save=setInterval(function(){
			db.save();
		},5000);
	}
	var get=function(){
		if(!inited){/*没初始，先初始*/
			var filename=_.last(__filename.split("/"));
			data_mg.findOne({id:filename},function(err,doc){
				if(err||!doc){
					db=new data_mg({id:"user",data:{}});
					newData.save(function(err){
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
	/*获取聊天记录*/
		function getList(socket,data,fn){
			console.log("zone/getList");
			if(typeof(data.data)=="string"){
				data.data=JSON.parse(data.data)
				}
			console.log(data.data);
			var result={code:0,
				time:0,
				data:{},
				success:false,
				message:""};
			var returnFn=function(){
				if(socket){
			 	socket.emit("zone_getList",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var self=tokenArry[data.data.tk];
			var returnList=_.filter(cache,function(point){
				return (point.user==self.id||_.some(self.friend.checked,function(friendPoind){
					return friendPoind.id==point.user
				}))
			});
			if(returnList&&returnList.length){
				result.data=returnList;
				result.success=true;
				result.code=1;
				result.time=new Date().getTime();
				console.log(result)
				returnFn();
			}else{
				result.success=false;
				console.log("获取空间信息出错");
				result.message="获取空间信息出错";
				returnFn();
			}
		};
		/*赞*/
		function praise(socket,data,fn,end){
			console.log("zone/praise");
			if(typeof(data.data)=="string"){
				data.data=JSON.parse(data.data)
				}
			console.log(data.data);
			var result={code:0,
				time:0,
				data:{},
				success:false,
				message:""};
			var returnFn=function(){
				if(socket){
			 	socket.emit("zone_praise",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.zid].praise.push(data.data.id);
				
				if(end){
					result.data=cache[data.data.zid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.praise(socket,data,fn,true);	
				}
			
		};
		/*取消赞*/
		function cancelPraise(socket,data,fn,end){
			console.log("zone/cancelPraise");
			if(typeof(data.data)=="string"){
				data.data=JSON.parse(data.data)
				}
			console.log(data.data);
			var result={code:0,
				time:0,
				data:{},
				success:false,
				message:""};
			var returnFn=function(){
				if(socket){
			 	socket.emit("zone_cancelPraise",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.zid].praise=_.without(cache[data.data.zid].praise,data.data.id);
			
				if(end){
					result.data=cache[data.data.zid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.cancelPraise(socket,data,fn,true);
				}
			
		};
		/*关注*/
		function attention(socket,data,fn,end){
			console.log("zone/attention");
			if(typeof(data.data)=="string"){
				data.data=JSON.parse(data.data)
				}
			console.log(data.data);
			var result={code:0,
				time:0,
				data:{},
				success:false,
				message:""};
			var returnFn=function(){
				if(socket){
			 	socket.emit("zone_attention",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.zid].attention.push(data.data.id);
			
				if(end){
					result.data=cache[data.data.zid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.attention(socket,data,fn,true);
				}
			
		};
		/*取消关注*/
		function cancelAttention(socket,data,fn,end){
			console.log("zone/cancelAttention");
			if(typeof(data.data)=="string"){
				data.data=JSON.parse(data.data)
				}
			console.log(data.data);
			var result={code:0,
				time:0,
				data:{},
				success:false,
				message:""};
			var returnFn=function(){
				if(socket){
			 	socket.emit("zone_cancelAttention",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.zid].attention=_.without(cache[data.data.zid].attention,data.data.id);
			
				if(end){
					result.data=cache[data.data.zid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.cancelAttention(socket,data,fn,true);
				}
			
		};
		/*看了*/
		function readed(socket,data,fn,end){
			console.log("zone/readed");
			if(typeof(data.data)=="string"){
				data.data=JSON.parse(data.data)
				}
			console.log(data.data);
			var result={code:0,
				time:0,
				data:{},
				success:false,
				message:""};
			var returnFn=function(){
				if(socket){
			 	socket.emit("zone_readed",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.zid].readed.push(data.data.id);
			
				if(end){
					result.data=cache[data.data.zid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.readed(socket,data,fn,true);
				}
			
		};
		/*分享*/
		function share(socket,data,fn,end){
			console.log("zone/share");
			if(typeof(data.data)=="string"){
				data.data=JSON.parse(data.data)
				}
			console.log(data.data);
			var result={code:0,
				time:0,
				data:{},
				success:false,
				message:""};
			var returnFn=function(){
				if(socket){
			 	socket.emit("zone_share",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.zid].share.push(data.data.id);
			
				if(end){
					result.data=cache[data.data.zid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.share(socket,data,fn,true);
				}
			
		};
		/*回复*/
		function reply(socket,data,fn,end){
			console.log("zone/reply");
			if(typeof(data.data)=="string"){
				data.data=JSON.parse(data.data)
				}
			console.log(data.data);
			var result={code:0,
				time:0,
				data:{},
				success:false,
				message:""};
			var returnFn=function(){
				if(socket){
			 	socket.emit("zone_reply",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.zid].reply.push({form:data.data.id,to:data.data.to,text:data.data.text,readed:false,time:new Date().getTime()});
			
				if(end){
					result.data=cache[data.data.zid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.reply(socket,data,fn,true);
				}
			
		};
		/*发帖*/
		function add(socket,data,fn){
			console.log("zone/add");
			if(typeof(data.data)=="string"){
				data.data=JSON.parse(data.data)
				}
			console.log(data.data);
			var result={code:0,
				time:0,
				data:{},
				success:false,
				message:""};
			var returnFn=function(){
				if(socket){
			 	socket.emit("zone_add",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var self=tokenArry[data.data.tk];
			var newId=tool.uuid();
				cache[newId]={
					id:newId,
					time:new Date().getTime(),
					icon:self.icon,
					name:self.name,
					user:self.id,
					text:data.data.text,
					pic:data.data.pic,
					praise:[],
					attention:[],
					readed:[],
					share:[],
					reply:[]	
				};
				result.data=cache[newId];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		};
		exports.getList=function(socket,data,fn){
			getList(socket,data,fn);
		};
		exports.praise=function(socket,data,fn,end){
			praise(socket,data,fn,end);
		};
		exports.cancelPraise=function(socket,data,fn,end){
			cancelPraise(socket,data,fn,end);
		};
		exports.attention=function(socket,data,fn,end){
			attention(socket,data,fn,end);
		};
		exports.cancelAttention=function(socket,data,fn,end){
			cancelAttention(socket,data,fn,end);
		};
		exports.readed=function(socket,data,fn,end){
			readed(socket,data,fn,end);
		};
		exports.share=function(socket,data,fn,end){
			share(socket,data,fn,end);
		};
		exports.reply=function(socket,data,fn,end){
			reply(socket,data,fn,end);
		};
		exports.add=function(socket,data,fn){
				add(socket,data,fn);
		};
