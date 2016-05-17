var modelName=_.last(__filename.split("\\")).split(".")[0];
	/*创建相册*/
	function creatFn(cache,data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		var self=tokenArry[data.tk].user;
			if(!data.aid){
				data.aid=tool.uuid();
			};
			cache[data.aid]=new data_mg.album({
				id:data.aid,
				name:data.name,
				icon:"",
				dsc:data.dsc,
				user:self.id,
				type:data.type,
				time:new Date().getTime(),
				list:[]
			});
		successFn(cache[data.aid],cache);
	};
	var creat=new tool.factory(null,exports,modelName,"creat",creatFn,"user","creatAlbum");
	/**************************************************************/
	/*删除相册*/
	function removeFn(cache,data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		cache[data.aid].remove();
		successFn(true);
	};
	var remove=new tool.factory('{id:data.aid}',exports,modelName,"remove",removeFn,"user","removeAlbum");
	/**************************************************************/
	/*添加图片*/
	function addPicFn(cache,data,successFn,errFn){
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
		successFn(cache[data.aid],cache);
	};
	var addPic=new tool.factory('{id:data.aid}',exports,modelName,"addPic",addPicFn,"zone","addAlbumPic");
	/**************************************************************/
	/*删除图片*/
	function removePicFn(cache,data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		cache[data.aid].list=_.reject(cache[data.aid].list,{id:data.pid});
		successFn(cache[data.aid],cache);
	};
	var removePic=new tool.factory('{id:data.aid}',exports,modelName,"removePic",removePicFn);
	/**************************************************************/
	/*获取相册列表*/
	function getAlbumListFn(cache,data,successFn,errFn){
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
	var getAlbumList=new tool.factory('{id:data.uid}',exports,modelName,"getAlbumList",getAlbumListFn);
	/**************************************************************/
	/*设置封面*/
	function setIconFn(cache,data,successFn,errFn){
		if(!tokenArry[data.tk].user){
			errFn("请先登录");
			return false;
		}
		cache[data.aid].icon=data.url;
		successFn(cache[data.aid],cache);
	};
	var setIcon=new tool.factory('{id:data.aid}',exports,modelName,"setIcon",setIconFn);