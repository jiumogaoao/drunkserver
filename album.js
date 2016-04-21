
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
	/*创建相册*/
	function creatFn(data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
			if(!data.aid){
				data.aid=tool.uuid();
			};
			cache[data.aid]={
				id:data.aid,
				name:data.name,
				icon:"",
				dsc:data.dsc,
				user:self.id,
				type:data.type,
				time:new Date().getTime(),
				list:[]
			};
		successFn(cache[data.aid]);
	};
	var creat=new tool.factory(exports,modelName,"creat",creatFn,"user","creatAlbum");
	/**************************************************************/
	/*删除相册*/
	function removeFn(data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		delete cache[data.aid];
		successFn(true);
	};
	var remove=new tool.factory(exports,modelName,"remove",removeFn,"user","removeAlbum");
	/**************************************************************/
	/*添加图片*/
	function addPicFn(data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		cache[data.aid].list.push({
				id:tool.uuid(),
				src:data.src,
				time:new Date().getTime(),
				name:""
			});
		successFn(cache[data.aid]);
	};
	var addPic=new tool.factory(exports,modelName,"addPic",addPicFn,"zone","addAlbumPic");
	/**************************************************************/
	/*删除图片*/
	function removePicFn(data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		cache[data.aid].list=_.reject(cache[data.aid].list,{id:data.pid});
		successFn(cache[data.aid]);
	};
	var removePic=new tool.factory(exports,modelName,"removePic",removePicFn);
	/**************************************************************/
	/*获取相册列表*/
	function getAlbumListFn(data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
			if(!data.uid){
				data.uid=self.id;
			}
			var showList=_.filter(cache,function(point){
				return point.user==data.uid
			});
		successFn(showList);
	};
	var getAlbumList=new tool.factory(exports,modelName,"getAlbumList",getAlbumListFn);
	/**************************************************************/
	/*设置封面*/
	function setIconFn(data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		cache[data.aid].icon=data.url;
		successFn(cache[data.aid]);
	};
	var setIcon=new tool.factory(exports,modelName,"setIcon",setIconFn);