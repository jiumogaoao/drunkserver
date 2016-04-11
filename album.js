
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
	function creat(socket,data,fn,end){
		console.log("album/creat");
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
			 	socket.emit("album_creat",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var self=tokenArry[data.data.tk];
			if(!data.data.aid&&!end){
				data.data.aid=tool.uuid();
			};
			cache[data.data.aid]={
				id:data.data.aid,
				name:data.data.name,
				icon:"",
				dsc:data.data.dsc,
				user:self.id,
				type:data.data.type,
				time:new Date().getTime(),
				list:[]
			};

				if(end){
					result.data=cache[data.data.aid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.creatAlbum(socket,data,fn,true);	
				}

		};
		/*删除相册*/
		function remove(socket,data,fn,end){
			console.log("album/remove");
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
			 	socket.emit("album_remove",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			delete cache[data.data.aid];
			
				if(end){
					result.data=null;
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
				}else{
					server.user.removeAlbum(socket,data,fn,true);	
				}
			
		};
		/*添加图片*/
		function addPic(socket,data,fn){
			console.log("album/addPic");
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
			 	socket.emit("album_addPic",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.aid].list.push({
				id:tool.uuid(),
				src:data.data.src,
				time:new Date().getTime(),
				name:""
			});
			result.data=cache[data.data.aid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		};
		/*删除图片*/
		function removePic(socket,data,fn){
			console.log("album/removePic");
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
			 	socket.emit("album_removePic",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.aid].list=_.reject(cache[data.data.aid].list,{id:data.data.pid});
			result.data=cache[data.data.aid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		};
		/*获取相册列表*/
		function getAlbumList(socket,data,fn){
			console.log("album/getAlbumList");
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
			 	socket.emit("album_getAlbumList",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			var self=tokenArry[data.data.tk];
			if(!data.data.uid){
				data.data.uid=self.id;
			}
			var showList=_.filter(cache,function(point){
				return point.user==data.data.uid
			});
			result.data=showList;
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		}

		/*设置封面*/
		function setIcon(socket,data,fn){
			console.log("album/setIcon");
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
			 	socket.emit("album_setIcon",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
			}
			cache[data.data.aid].icon=data.data.url;
			result.data=cache[data.data.aid];
					result.success=true;
					result.code=1;
					result.time=new Date().getTime();
					console.log(result)
					returnFn();
		};
		exports.creat=function(socket,data,fn,end){
			creat(socket,data,fn,end);
		};
		exports.remove=function(socket,data,fn,end){
			remove(socket,data,fn,end);
		};
		exports.addPic=function(socket,data,fn){
			addPic(socket,data,fn);
		}
		exports.removePic=function(socket,data,fn){
			removePic(socket,data,fn);
		}
		exports.getAlbumList=function(socket,data,fn){
			getAlbumList(socket,data,fn);
		}
		exports.setIcon=function(socket,data,fn){
			setIcon(socket,data,fn);
		}
