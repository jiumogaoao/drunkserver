
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
			console.log("message/getList");
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
			 	socket.emit("message_getList",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var self=tokenArry[data.data.tk];
			var returnList=[];
			_.each(cache,function(point){
				if((point.from==self.id&&point.to==data.data.to&&point.state==0) || (point.to==self.id&&point.from==data.data.to&&point.state==0)){
					if(point.from==self.id){
						point.self=true;
					}else{
						point.self=false;
					}
					returnList.push(point);
				}
			});
			returnList=_.sortBy(returnList,"time");
			returnList=_.groupBy(returnList,function(point){
				return moment(point.time,"x").format("YYYY-MM-DD");
			});
			if(returnList){
				result.data=returnList;
				result.success=true;
				result.code=1;
				result.time=new Date().getTime();
				console.log(result)
				returnFn();
			}else{
				result.success=false;
				console.log("获取聊天信息出错");
				result.message="获取聊天信息出错";
				returnFn();
			}
		};
	/*获取组聊天记录*/
		function getGroupList(socket,data,fn){
			console.log("message/getGroupList");
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
			 	socket.emit("message_getGroupList",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var self=tokenArry[data.data.tk];
			var returnList=[];
			_.each(cache,function(point){
				if(point.to==data.data.to&&point.state==1){
					if(point.from==self.id){
						point.self=true;
					}else{
						point.self=false;
					}
					returnList.push(point);
				}
			});
			returnList=_.sortBy(returnList,"time");
			returnList=_.groupBy(returnList,function(point){
				return moment(point.time,"x").format("YYYY-MM-DD");
			});
			if(returnList){
				result.data=returnList;
				result.success=true;
				result.code=1;
				result.time=new Date().getTime();
				console.log(result)
				returnFn();
			}else{
				result.success=false;
				console.log("获取聊天信息出错");
				result.message="获取聊天信息出错";
				returnFn();
			}
		}
		/*聊天列表*/
		function getMessageList(socket,data,fn){
			console.log("message/getMessageList");
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
			 	socket.emit("message_getMessageList",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var self=tokenArry[data.data.tk];
			var returnList={};
			_.each(cache,function(point){
				if(((point.to==self.id||point.from==self.id)&&point.state==0)||((_.some(self.group.creat,point.to)||_.some(self.group.admin,point.to)||_.some(self.group.member,point.to))&&point.state==1)){
					if(point.state==0){
						if(point.to==self.id){
							if(!returnList[point.from]){
								returnList[point.from]=[];
							}
							returnList[point.from].push(point);
						}else{
							if(!returnList[point.to]){
								returnList[point.to]=[];
							}
							returnList[point.to].push(point);
						}
					}else{
						if(!returnList[point.to]){
								returnList[point.to]=[];
							}
							returnList[point.to].push(point);
					}
				}
			});
			if(returnList){
				result.data=returnList;
				result.success=true;
				result.code=1;
				result.time=new Date().getTime();
				console.log(result)
				returnFn();
			}else{
				result.success=false;
				console.log("获取聊天信息出错");
				result.message="获取聊天信息出错";
				returnFn();
			}
		}
		/*聊天*/
		function add(socket,data,fn){
			console.log("message/add");
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
			 	socket.emit("message_add",result);
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
					from:self.id,
					name:self.name,
					icon:self.icon,
					to:data.data.to,
					state:data.data.state,
					type:data.data.type,
					main:data.data.main,
					readed:false
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
		exports.getGroupList=function(socket,data,fn){
			getGroupList(socket,data,fn);
		}
		exports.add=function(socket,data,fn){
				add(socket,data,fn);
		};
		exports.getMessageList=function(socket,data,fn){
			getMessageList(socket,data,fn);
		};
