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
	/*创建组*/
		function add(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("group/add");
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
			 	socket.emit("group_add",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			if(!data.data.gid&&!end){
				data.data.gid=tool.uuid();
			}
			var self=tokenArry[data.data.tk];
			cache[data.data.gid]={
				id:data.data.gid,
				name:data.data.name,
				dsc:"",
				icon:data.data.icon,
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
			
				if(end){
					result.data=cache[data.data.gid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.creatGroup(socket,data,fn,true);	
				}
			
		};
		function join(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("group/join");
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
			 	socket.emit("group_join",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			if(!data.data.gid&&!end){
				data.data.gid=tool.uuid();
			}
			var self=tokenArry[data.data.tk];
			if(!data.data.uid){
				data.data.uid=self.id
			}
			cache[data.data.gid].member.push({id:data.data.uid,nickName:"",type:"owner"});
			
				if(end){
					result.data=cache[data.data.gid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.joinGroup(socket,data,fn,true);	
				}
			
		};
		function out(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("group/out");
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
			 	socket.emit("group_out",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var self=tokenArry[data.data.tk];
			cache[data.data.gid].member=_.reject(cache[data.data.gid].member,{id:data.data.uid});
			
				if(end){
					result.data=cache[data.data.gid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.outGroup(socket,data,fn,true);	
				}
			
		};
		function addAdmin(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("group/addAdmin");
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
			 	socket.emit("group_addAdmin",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var returnObj=_.findWhere(cache[data.data.gid].member,{id:data.data.uid});
			returnObj.type="admin";
			
				if(end){
					result.data=returnObj;
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.addAdminGroup(socket,data,fn,true);	
				}
			
		};
		function cancelAdmin(socket,data,fn,end){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("group/cancelAdmin");
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
			 	socket.emit("group_cancelAdmin",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var returnObj=_.findWhere(cache[data.data.gid].member,{id:data.data.uid});
			returnObj.type="member";
			
				if(end){
					result.data=returnObj;
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.cancelAdminGroup(socket,data,fn,true);	
				}
			
		};
		function searchNotGroup(socket,data,fn){
			var self=tokenArry[data.data.tk];
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("group/searchNotGroup");
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
			 	socket.emit("group_searchNotGroup",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var returnList=_.reject(cache, function(point){
			 return _.some(point.member,{id:self.id}); 
			});
			result.data=returnList;
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
			
		}
		function getList(socket,data,fn){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("group/getList");
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
			 	socket.emit("group_getList",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var returnObj={};
			_.each(data.data.idArry,function(point){
				returnObj[point]=_.pick(cache[point],"id","name","dsc","type","icon");
			});
			result.data=returnObj;
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		}
		function getMyList(socket,data,fn){
			if(!inited){
				console.log("数据未同步成功，请稍后再试");
				return false;
			};
			console.log("group/getMyList");
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
			 	socket.emit("group_getMyList",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var self=tokenArry[data.data.tk];
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

			result.data=returnObj;
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		}
		module.exports.add=function(socket,data,fn,end){
			add(socket,data,fn,end);
		};
		module.exports.join=function(socket,data,fn,end){
			join(socket,data,fn,end);
		};
		module.exports.out=function(socket,data,fn,end){
			out(socket,data,fn,end);
		};
		module.exports.addAdmin=function(socket,data,fn,end){
			addAdmin(socket,data,fn,end);
		};
		module.exports.cancelAdmin=function(socket,data,fn,end){
			cancelAdmin(socket,data,fn,end);
		};
		module.exports.searchNotGroup=function(socket,data,fn){
			searchNotGroup(socket,data,fn);
		}
		module.exports.getList=function(socket,data,fn){
			getList(socket,data,fn);
		}
		module.exports.getMyList=function(socket,data,fn){
			getMyList(socket,data,fn);
		}

