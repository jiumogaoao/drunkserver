
	var cache={};
	var db={};
	var inited=false;
	var initEnd=function(){
		cache=db.data||{};
		console.log("initEnd:"+cache)
		inited=true;
		var save=setInterval(function(){
			db.save();
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
	/*获取token*/
	function getTokenFn(data,successFn,errFn){
		console.log(tokenArry);
	if(data.tk&&tokenArry[data.tk]){
		console.log("有传入tk,且已有");
		if(tokenArry[data.tk].id){
			successFn({tk:data.tk,user:tokenArry[data.tk]});
		}else{
			successFn({tk:data.tk,user:null});
		}	
		}else{
		console.log("新tk");
		var tokenA=data.tk||tool.uuid();
		console.log(tokenA);
		tokenArry[tokenA]={};
		console.log(tokenArry)
	var clearTime=setTimeout(function(){
		console.log("tk失效");
		delete tokenArry[tokenA];
		},1000*60*60*2);
		successFn({tk:tokenA,user:null});
			}
	}
	var getToken=new tool.factory(exports,modelName,"getToken",getTokenFn);
	/********************************************************************/
	/*登录*/
	function loginFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				if(fn){fn(false);}
				return false;
			};
		var loginResult=_.find(cache,function(point){
				return (point.name==data.name&&point.key==data.key)||(point.phone==data.name&&point.key==data.key)
			});
			if(loginResult){
				tokenArry[data.tk]=_.omit(loginResult,'key');
				successFn(tokenArry[data.tk]);
			}else{
				errFn("帐号或密码错误","帐号或密码错误");
			}
	};
	var login=new tool.factory(exports,modelName,"login",loginFn);
	/********************************************************************/
	/*注册*/
	function regestFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				if(fn){fn(false);}
				return false;
			};
		if(_.findWhere(cache,{name:data.name})){
				errFn("帐号已有","帐号已有");
			}else{/*写入*/
				console.log("cache:"+cache);
				var newId=tool.uuid();
				cache[newId]={
					id:newId,
					name:data.name,
					phone:data.name,
					key:data.key,
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
				successFn(cache[newId]);
			}
	};	
	var regest=new tool.factory(exports,modelName,"regest",regestFn);
	/********************************************************************/
	/*添加好友*/
	function addFriendFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				if(fn){fn(false);}
				return false;
			};
		if(!_.contains(cache[data.to].friend.reject, tokenArry[data.tk].id)){
				tokenArry[data.tk].friend.request.push({id:data.to,time:new Date().getTime()});
				cache[data.to].friend.response.push({id:tokenArry[data.tk].id,time:new Date().getTime()});
				successFn(tokenArry[data.tk]);
			}else{
				errFn("请求被拒绝","请求被拒绝");
			}
	};
	var addFriend=new tool.factory(exports,modelName,"addFriend",addFriendFn);
	/********************************************************************/
	/*拒绝添加好友*/
	function rejectFriendFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[data.to].friend.reject.push({id:data.from,time:new Date().getTime()});
			cache[data.from].friend.request=_.reject(cache[data.from].friend.request,{id:data.to});
			cache[data.to].friend.response=_.reject(cache[data.from].friend.response,{id:data.from});
			successFn(tokenArry[data.tk]);
	};
	var rejectFriend=new tool.factory(exports,modelName,"rejectFriend",rejectFriendFn);
	/********************************************************************/
	/*确认添加好友*/
	function checkFriendFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			cache[tokenArry[data.tk].id].friend.checked.push({id:data.to,time:new Date().getTime(),groupId:"all"});
			cache[data.to].friend.checked.push({id:tokenArry[data.tk].id,time:new Date().getTime(),groupId:"all"});
			cache[data.to].friend.request=_.reject(cache[data.to].friend.request,{id:tokenArry[data.tk].id});
			cache[tokenArry[data.tk].id].friend.response=_.reject(cache[tokenArry[data.tk].id].friend.response,{id:data.to});
			successFn(tokenArry[data.tk]);
	};
	var checkFriend=new tool.factory(exports,modelName,"checkFriend",checkFriendFn);
	/********************************************************************/
	/*删除好友*/
	function removeFriendFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			cache[data.to].friend.reject.push({id:data.from,time:new Date().getTime()});
			cache[data.from].friend.checked=_.reject(cache[data.from].friend.checked,{id:data.to});
			cache[data.to].friend.checked=_.reject(cache[data.from].friend.checked,{id:data.from});
			successFn(tokenArry[data.tk]);
	};
	var removeFriend=new tool.factory(exports,modelName,"removeFriend",removeFriendFn);
	/********************************************************************/
	/*赞*/
	function praiseFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[data.id].praise.push(data.zid);
		successFn(tokenArry[data.tk]);
	};
	var praise=new tool.factory(exports,modelName,"praise",praiseFn,"zone","praise");
	/********************************************************************/
	/*取消赞*/
	function cancelPraiseFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[data.id].praise=_.without(cache[data.id].praise,data.zid);
		successFn(tokenArry[data.tk]);	
	};
	var cancelPraise=new tool.factory(exports,modelName,"cancelPraise",cancelPraiseFn,"zone","cancelPraise");
	/********************************************************************/
	/*关注*/
	function attentionFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[data.id].attention.push(data.zid);
		successFn(tokenArry[data.tk]);	
	};
	var attention=new tool.factory(exports,modelName,"attention",attentionFn,"zone","attention");
	/********************************************************************/
	/*取消关注*/
	function cancelAttentionFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[data.id].attention=_.without(cache[data.id].attention,data.zid);
		successFn(tokenArry[data.tk]);	
	};
	var cancelAttention=new tool.factory(exports,modelName,"cancelAttention",cancelAttentionFn,"zone","cancelAttention");
	/********************************************************************/
	/*看了*/
	function readedFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[data.id].readed.push(data.zid);
		successFn(tokenArry[data.tk]);	
	};
	var readed=new tool.factory(exports,modelName,"readed",readedFn,"zone","readed");
	/********************************************************************/
	/*分享*/
	function shareFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[data.id].share.push(data.zid);
		successFn(tokenArry[data.tk]);	
	};
	var share=new tool.factory(exports,modelName,"share",shareFn,"zone","share");
	/********************************************************************/
	/*回复*/
	function replyFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[data.id].reply.push({form:data.id,to:data.to,text:data.text,readed:false,time:new Date().getTime(),zid:data.zid});
		successFn(tokenArry[data.tk]);	
	};
	var reply=new tool.factory(exports,modelName,"reply",replyFn,"zone","reply");
	/********************************************************************/
	/*创建组*/
	function creatGroupFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		if(!data.gid&&!end){
				data.gid=tool.uuid();
			}
		cache[tokenArry[data.tk].id].group.creat.push(data.gid);
		successFn(tokenArry[data.tk]);
	};
	var creatGroup=new tool.factory(exports,modelName,"creatGroup",creatGroupFn,"group","add");
	/********************************************************************/
	/*加入组*/
	function joinGroupFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		if(!data.uid){
				data.uid=tokenArry[data.tk].id;
			}
		cache[data.uid].group.member.push(data.gid);
		successFn(tokenArry[data.tk]);
	};
	var joinGroup=new tool.factory(exports,modelName,"joinGroup",joinGroupFn,"group","join");
	/********************************************************************/
	/*退出组*/
	function outGroupFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[data.uid].group.member=_.without(cache[data.uid].group.member,data.gid);
		cache[data.uid].group.creat=_.without(cache[data.uid].group.creat,data.gid);
		cache[data.uid].group.admin=_.without(cache[data.uid].group.admin,data.gid);
		successFn(tokenArry[data.tk]);
	};
	var outGroup=new tool.factory(exports,modelName,"outGroup",outGroupFn,"group","out");
	/********************************************************************/
	/*添加管理员*/
	function addAdminGroupFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[data.uid].group.member=_.without(cache[tokenArry[data.tk].id].group.member,data.gid);
		cache[data.uid].group.admin.push(data.gid);
		successFn(tokenArry[data.tk]);
	};
	var addAdminGroup=new tool.factory(exports,modelName,"addAdminGroup",addAdminGroupFn,"group","addAdmin");
	/********************************************************************/
	/*去除管理员*/
	function cancelAdminGroupFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[data.uid].group.admin=_.without(cache[tokenArry[data.tk].id].group.member,data.gid);
		cache[data.uid].group.member.push(data.gid);
		successFn(tokenArry[data.tk]);
	};
	var cancelAdminGroup=new tool.factory(exports,modelName,"cancelAdminGroup",cancelAdminGroupFn,"group","cancelAdmin");
	/********************************************************************/	
	/*创建相册*/
	function creatAlbumFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[tokenArry[data.tk].id].album.push(data.aid);
		successFn(tokenArry[data.tk]);
	};
	var creatAlbum=new tool.factory(exports,modelName,"creatAlbum",creatAlbumFn,"album","creat");
	/********************************************************************/
	/*删除相册*/
	function removeAlbumFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		cache[tokenArry[data.tk].id].album=_.without(cache[tokenArry[data.tk].id].album,data.aid);
		successFn(tokenArry[data.tk]);
	};
	var removeAlbum=new tool.factory(exports,modelName,"removeAlbum",removeAlbumFn,"album","remove");
	/********************************************************************/
	/*搜索没添加的人*/
	function searchNotFriendFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		var returnList=[];
			var searchList=_.reject(cache, function(point){
			 return _.some(point.friend.checked,{id:tokenArry[data.tk].id})||point.id==tokenArry[data.tk].id; 
			});
			_.each(searchList,function(point){
				returnList.push(_.pick(point,'id','name','icon','dsc'));
			});
		successFn(returnList);
	};
	var searchNotFriend=new tool.factory(exports,modelName,"searchNotFriend",searchNotFriendFn);
	/********************************************************************/
	/*返回好友列表*/
	function getFriendListFn(data,successFn,errFn){
		if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
		var returnObj={
				checked:[],
				request:[],
				response:[],
				reject:[],
				friendGroup:cache[tokenArry[data.tk].id].friendGroup
			};
			_.each(cache[tokenArry[data.tk].id].friend.checked,function(point){
				var addObj=_.pick(cache[point.id],'id','name','icon','dsc');
				addObj.time=point.time;
				addObj.groupId=point.groupId;
				returnObj.checked.push(addObj);
			});
			_.each(cache[tokenArry[data.tk].id].friend.request,function(point){
				var addObj=_.pick(cache[point.id],'id','name','icon','dsc');
				addObj.time=point.time;
				returnObj.request.push(addObj);
			});
			_.each(cache[tokenArry[data.tk].id].friend.response,function(point){
				var addObj=_.pick(cache[point.id],'id','name','icon','dsc');
				addObj.time=point.time;
				returnObj.response.push(addObj);
			});
			_.each(cache[tokenArry[data.tk].id].friend.reject,function(point){
				var addObj=_.pick(cache[point.id],'id','name','icon','dsc');
				addObj.time=point.time;
				returnObj.reject.push(addObj);
			});
		successFn(returnObj);
	};
	var getFriendList=new tool.factory(exports,modelName,"getFriendList",getFriendListFn);
	/********************************************************************/
	/*设置个人信息*/
	function editDetailFn(data,successFn,errFn){
		data.editData=_.pick(data.editData,"name","sex","birthday","job","company","school","province","city","hometown","email","dsc");
		cache[tokenArry[data.tk].id]=_.extend(cache[tokenArry[data.tk].id],data.editData);
		tokenArry[data.tk]=_.omit(cache[tokenArry[data.tk].id],"key");
		successFn(tokenArry[data.tk]);
	};
	var editDetail=new tool.factory(exports,modelName,"editDetail",editDetailFn);
	/********************************************************************/
	/*更换名片背景*/
	function changeBackgroundFn(data,successFn,errFn){
		cache[tokenArry[data.tk].id].background=data.src;
		tokenArry[data.tk].background=data.src;
		successFn(tokenArry[data.tk]);
	};
	var changeBackground=new tool.factory(exports,modelName,"changeBackground",changeBackgroundFn);
	/********************************************************************/
	/*更换头像*/
	function changeIconFn(data,successFn,errFn){
		cache[tokenArry[data.tk].id].icon=data.src;
		tokenArry[data.tk].icon=data.src;
		successFn(tokenArry[data.tk]);
	};
	var changeIcon=new tool.factory(exports,modelName,"changeIcon",changeIconFn);