
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
	/**************************************************************/
	function getToken(socket,data,fn){
	console.log("user/getToken");
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
	 	socket.emit("client_getToken",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
	}
	console.log(tokenArry);
	if(data.data.tk&&tokenArry[data.data.tk]){
		console.log("有传入tk,且已有");
		if(tokenArry[data.data.tk].id){
			result.data={tk:data.data.tk,user:tokenArry[data.data.tk]};
			result.success=true;
			result.code=1;
			result.time=new Date().getTime();
			returnFn();
		}else{
			result.data={tk:data.data.tk,user:null};
			result.success=true;
			result.code=1;
			result.time=new Date().getTime();
			console.log(result)
			returnFn();
		}	
		}else{
		console.log("新tk");
		var tokenA=data.data.tk||tool.uuid();
		console.log(tokenA);
		tokenArry[tokenA]={};
		console.log(tokenArry)
	var clearTime=setTimeout(function(){
		console.log("tk失效");
		delete tokenArry[tokenA];
		},1000*60*60*2);
		result.data={tk:data.data.tk,user:null};
		result.success=true;
		result.code=1;
		result.time=new Date().getTime();
		console.log(result)
		returnFn();	
			}
	};
	/********************************************************************/
		/*登录*/
		function login(socket,data,fn){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				if(fn){fn(false);}
				return false;
			};
			console.log("user/login");
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
			 	socket.emit("user_login",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var loginResult=_.find(cache,function(point){
				return (point.name==data.data.name&&point.key==data.data.key)||(point.phone==data.data.name&&point.key==data.data.key)
			});
			if(loginResult){
				tokenArry[data.data.tk]=_.omit(loginResult,'key');
				result.data=tokenArry[data.data.tk];
				result.success=true;
				result.code=1;
				result.time=new Date().getTime();
				console.log(result)
				returnFn();	
			}else{
				result.success=false;
				console.log("帐号或密码错误");
				result.message="帐号或密码错误";
				returnFn();
			}
		};
		/*注册*/
		function regest(socket,data,fn){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				if(fn){fn(false);}
				return false;
			};
			console.log("user/regest");
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
			 	socket.emit("user_regest",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			if(_.findWhere(cache,{name:data.data.name})){
				result.success=false;
				console.log("帐号已有");
				result.message="帐号已有";
				returnFn();
			}else{/*写入*/
				var newId=tool.uuid();
				cache[newId]={
					id:newId,
					name:data.data.name,
					phone:data.data.name,
					key:data.data.key,
					step:["star"],
					stepDay:0,
					icon:"img/head.jpg",
					background:"img/myDetailBg.jpg",
					zoneBackground:"img/zoneBg.jpg",
					dsc:"",
					mood:"",
					sex:0,
					province:"",
					city:"",
					birthday:0,
					job:"",
					company:"",
					school:"",
					hometown:"",
					email:"",
					mine:{
						interested:"",
						music:"",
						idol:"",
						readed:"",
						heared:""
					},
					album:[],
					group:{
						creat:[],
						admin:[],
						member:[]
					},
					money:0,
					vip:null,
					vipDay:0,
					diy:{
						pop:null,
						redpacket:null,
						style:null,
						font:null,
						ticket:null,
						call:null,
						background:null,
						face:null,
						music:null,
						suit:null,
						pandant:null
					},
					collection:[],
					file:[],
					praise:[],
					attention:[],
					readed:[],
					totalReaded:[],
					share:[],
					reply:[],
					friend:{
						checked:[],
						request:[],
						response:[],
						reject:[]
					},
					friendGroup:{
						"all":{id:"all",name:"我的好友"}
					}
				};
				result.data=cache[newId];
				result.success=true;
				result.code=1;
				result.time=new Date().getTime();
				console.log(result)
				returnFn();
			}
		};
		/*添加好友*/
		function addFriend(socket,data,fn){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				if(fn){fn(false);}
				return false;
			};
			console.log("user/addFriend");
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
			 	socket.emit("user_addFriend",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			if(!_.contains(cache[data.data.to].friend.reject, tokenArry[data.data.tk].id)){
				tokenArry[data.data.tk].friend.request.push({id:data.data.to,time:new Date().getTime()});
				cache[data.data.to].friend.response.push({id:tokenArry[data.data.tk].id,time:new Date().getTime()});
				result.data=tokenArry[data.data.tk];
				result.success=true;
				result.code=1;
				result.time=new Date().getTime();
				console.log(result)
				returnFn();
			}else{
				result.success=false;
				console.log("请求被拒绝");
				result.message="请求被拒绝";
				returnFn();
			}
		};
		/*拒绝添加好友*/
		function rejectFriend(socket,data,fn){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/rejectFriend");
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
			 	socket.emit("user_rejectFriend",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.to].friend.reject.push({id:data.data.from,time:new Date().getTime()});
			cache[data.data.from].friend.request=_.reject(cache[data.data.from].friend.request,{id:data.data.to});
			cache[data.data.to].friend.response=_.reject(cache[data.data.from].friend.response,{id:data.data.from});
			result.data=tokenArry[data.data.tk];
			result.success=true;
			result.code=1;
			result.time=new Date().getTime();
			console.log(result)
			returnFn();
		};
		/*确认添加好友*/
		function checkFriend(socket,data,fn){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/checkFriend");
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
			 	socket.emit("user_checkFriend",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[tokenArry[data.data.tk].id].friend.checked.push({id:data.data.to,time:new Date().getTime(),groupId:"all"});
			cache[data.data.to].friend.checked.push({id:tokenArry[data.data.tk].id,time:new Date().getTime(),groupId:"all"});
			cache[data.data.to].friend.request=_.reject(cache[data.data.to].friend.request,{id:tokenArry[data.data.tk].id});
			cache[tokenArry[data.data.tk].id].friend.response=_.reject(cache[tokenArry[data.data.tk].id].friend.response,{id:data.data.to});
			result.data=tokenArry[data.data.tk];
			result.success=true;
			result.code=1;
			result.time=new Date().getTime();
			console.log(result)
			returnFn();
		};
		/*删除好友*/
		function removeFriend(socket,data,fn){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/removeFriend");
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
			 	socket.emit("user_removeFriend",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.to].friend.reject.push({id:data.data.from,time:new Date().getTime()});
			cache[data.data.from].friend.checked=_.reject(cache[data.data.from].friend.checked,{id:data.data.to});
			cache[data.data.to].friend.checked=_.reject(cache[data.data.from].friend.checked,{id:data.data.from});
			result.data=tokenArry[data.data.tk];
			result.success=true;
			result.code=1;
			result.time=new Date().getTime();
			console.log(result)
			returnFn();
		};
		/*赞*/
		function praise(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/praise");
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
			 	socket.emit("user_praise",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.id].praise.push(data.data.zid);
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.zone.praise(socket,data,fn,true);	
				}
		};
		/*取消赞*/
		function cancelPraise(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/cancelPraise");
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
			 	socket.emit("user_cancelPraise",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.id].praise=_.without(cache[data.data.id].praise,data.data.zid);
			
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.zone.cancelPraise(socket,data,fn,true);
				}
			
		};
		/*关注*/
		function attention(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/attention");
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
			 	socket.emit("user_attention",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.id].attention.push(data.data.zid);

				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.zone.attention(socket,data,fn,true);
				}

		};
		/*取消关注*/
		function cancelAttention(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/cancelAttention");
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
			 	socket.emit("user_cancelAttention",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.id].attention=_.without(cache[data.data.id].attention,data.data.zid);
			
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.zone.cancelAttention(socket,data,fn,true);
				}
			
		};
		/*看了*/
		function readed(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/readed");
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
			 	socket.emit("user_readed",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.id].readed.push(data.data.zid);
			
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.zone.readed(socket,data,fn,true);
				}
			
		};
		/*分享*/
		function share(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/share");
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
			 	socket.emit("user_share",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.id].share.push(data.data.zid);
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.zone.share(socket,data,fn,true);
				}
		};
		/*回复*/
		function reply(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/reply");
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
			 	socket.emit("user_reply",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.id].reply.push({form:data.data.id,to:data.data.to,text:data.data.text,readed:false,time:new Date().getTime(),zid:data.data.zid});
			
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.zone.reply(socket,data,fn,true);
				}
			
		};
		/*创建组*/
		function creatGroup(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/creatGroup");
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
			 	socket.emit("user_creatGroup",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			if(!data.data.gid&&!end){
				data.data.gid=tool.uuid();
			}
			cache[tokenArry[data.data.tk].id].group.creat.push(data.data.gid);
			
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.group.add(socket,data,fn,true);
				}
			
		};
		/*加入组*/
		function joinGroup(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/joinGroup");
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
			 	socket.emit("user_joinGroup",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			if(!data.data.uid){
				data.data.uid=tokenArry[data.data.tk].id;
			}
			cache[data.data.uid].group.member.push(data.data.gid);
			
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.group.join(socket,data,fn,true);
				}
			
		};
		/*退出组*/
		function outGroup(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/outGroup");
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
			 	socket.emit("user_outGroup",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.uid].group.member=_.without(cache[data.data.uid].group.member,data.data.gid);
			cache[data.data.uid].group.creat=_.without(cache[data.data.uid].group.creat,data.data.gid);
			cache[data.data.uid].group.admin=_.without(cache[data.data.uid].group.admin,data.data.gid);
			
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.group.out(socket,data,fn,true);
				}
			
		};
		/*添加管理员*/
		function addAdminGroup(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/addAdminGroup");
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
			 	socket.emit("user_addAdminGroup",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.uid].group.member=_.without(cache[tokenArry[data.data.tk].id].group.member,data.data.gid);
			cache[data.data.uid].group.admin.push(data.data.gid);

				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.group.addAdmin(socket,data,fn,true);
				}
			
		};
		/*去除管理员*/
		function cancelAdminGroup(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/cancelAdminGroup");
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
			 	socket.emit("user_cancelAdminGroup",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.uid].group.admin=_.without(cache[tokenArry[data.data.tk].id].group.member,data.data.gid);
			cache[data.data.uid].group.member.push(data.data.gid);
			
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.group.cancelAdmin(socket,data,fn,true);
				}
			
		};
		/*创建相册*/
		function creatAlbum(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/creatAlbum");
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
			 	socket.emit("user_creatAlbum",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[tokenArry[data.data.tk].id].album.push(data.data.aid);
			
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.album.creat(socket,data,fn,true);
				}
			
		};
		/*删除相册*/
		function removeAlbum(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/removeAlbum");
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
			 	socket.emit("user_removeAlbum",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[tokenArry[data.data.tk].id].album=_.without(cache[tokenArry[data.data.tk].id].album,data.data.aid);
			
				if(end){
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.album.remove(socket,data,fn,true);
				}
			
		};
		/*搜索没添加的人*/
		function searchNotFriend(socket,data,fn){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/searchNotFriend");
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
			 	socket.emit("user_searchNotFriend",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var returnList=[];
			var searchList=_.reject(cache, function(point){
			 return _.some(point.friend.checked,{id:tokenArry[data.data.tk].id})||point.id==tokenArry[data.data.tk].id; 
			});
			_.each(searchList,function(point){
				returnList.push(_.pick(point,'id','name','icon','dsc'));
			});
			result.data=returnList;
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		}
		/*返回好友列表*/
		function getFriendList(socket,data,fn){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("user/getFriendList");
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
			 	socket.emit("user_getFriendList",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var returnObj={
				checked:[],
				request:[],
				response:[],
				reject:[],
				friendGroup:cache[tokenArry[data.data.tk].id].friendGroup
			};
			_.each(cache[tokenArry[data.data.tk].id].friend.checked,function(point){
				var addObj=_.pick(cache[point.id],'id','name','icon','dsc');
				addObj.time=point.time;
				addObj.groupId=point.groupId;
				returnObj.checked.push(addObj);
			});
			_.each(cache[tokenArry[data.data.tk].id].friend.request,function(point){
				var addObj=_.pick(cache[point.id],'id','name','icon','dsc');
				addObj.time=point.time;
				returnObj.request.push(addObj);
			});
			_.each(cache[tokenArry[data.data.tk].id].friend.response,function(point){
				var addObj=_.pick(cache[point.id],'id','name','icon','dsc');
				addObj.time=point.time;
				returnObj.response.push(addObj);
			});
			_.each(cache[tokenArry[data.data.tk].id].friend.reject,function(point){
				var addObj=_.pick(cache[point.id],'id','name','icon','dsc');
				addObj.time=point.time;
				returnObj.reject.push(addObj);
			});
			result.data=returnObj;
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		}
		function editDetail(socket,data,fn){
			console.log("user/editDetail");
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
			 	socket.emit("user_editDetail",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			data.data.editData=_.pick(data.data.editData,"name","sex","birthday","job","company","school","province","city","hometown","email","dsc");
			cache[tokenArry[data.data.tk].id]=_.extend(cache[tokenArry[data.data.tk].id],data.data.editData);
			tokenArry[data.data.tk]=_.omit(cache[tokenArry[data.data.tk].id],"key");
					result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		}
		function changeBackground(src,fn){
			console.log("user/changeBackground");
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
			 	socket.emit("user_changeBackground",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[tokenArry[data.data.tk].id].background=data.data.src;
			tokenArry[data.data.tk].background=data.data.src;
			result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		}
		function changeIcon(socket,data,fn){
			console.log("user/changeIcon");
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
			 	socket.emit("user_changeIcon",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[tokenArry[data.data.tk].id].icon=data.data.src;
			tokenArry[data.data.tk].icon=data.data.src;
			result.data=tokenArry[data.data.tk];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		}
		exports.getToken=function(socket,data,fn){
			getToken(socket,data,fn);
		}
		exports.login=function(socket,data,fn){
			login(socket,data,fn);
		};
		exports.regest=function(socket,data,fn){
			regest(socket,data,fn);
		};
		exports.addFriend=function(socket,data,fn){
			addFriend(socket,data,fn);
		};
		exports.rejectFriend=function(socket,data,fn){
			rejectFriend(socket,data,fn)
		};
		exports.checkFriend=function(socket,data,fn){
			checkFriend(socket,data,fn);
		};
		exports.removeFriend=function(socket,data,fn){
			removeFriend(socket,data,fn);
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
		exports.creatGroup=function(socket,data,fn,end){
			creatGroup(socket,data,fn,end);
		};
		exports.joinGroup=function(socket,data,fn,end){
			joinGroup(socket,data,fn,end);
		};
		exports.outGroup=function(socket,data,fn,end){
			outGroup(socket,data,fn,end);
		};
		exports.addAdminGroup=function(socket,data,fn,end){
			addAdminGroup(socket,data,fn,end);
		};
		exports.cancelAdminGroup=function(socket,data,fn,end){
			cancelAdminGroup(socket,data,fn,end);
		};
		exports.creatAlbum=function(socket,data,fn,end){
			creatAlbum(socket,data,fn,end);
		}
		exports.removeAlbum=function(socket,data,fn,end){
			removeAlbum(socket,data,fn,end);
		};
		exports.searchNotFriend=function(socket,data,fn){
			searchNotFriend(socket,data,fn);
		};
		exports.getFriendList=function(socket,data,fn){
			getFriendList(socket,data,fn);
		};
		exports.editDetail=function(socket,data,fn){
			editDetail(socket,data,fn);
		};
		exports.changeBackground=function(socket,data,fn){
			changeBackground(socket,data,fn);
		}
		exports.changeIcon=function(socket,data,fn){
			changeIcon(socket,data,fn);
		}
