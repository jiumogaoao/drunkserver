function get(socket,data,fn){
	console.log("demo/get");
	console.log(data)
	//data.data = 10086/*不用传*/
	var result={
		code : 0,
		time : 0,
		data : []
		};
	var returnFn=function(){
		if(socket){
	 	socket.emit("demo_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	data_mg.updateTime.find({"parentKey":"demo"},function(err,doc){
		if(err){
			result.code=0
			returnFn()
			}else{
				if(doc&&doc.length&&doc[0].childKey>data.data){
					result.time=doc[0].childKey;
					data_mg.demo.find({},function(errA,docA){
						if(errA){
							result.code=0
							}else{
								result.code=1;
								result.data=docA
								}
							returnFn()
						})
					}else{
						result.code=2
						returnFn()
						}
				}
		})
		
};

function add(socket,data,fn){
	console.log("demo/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("demo_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
		console.log("创建商品")
	var newdemo=new data_mg.demo(data.data);
	newdemo.save(function(err){
		if(err){console.log(err)
			result.code=0
			returnFn()
			}else{console.log("更新时间")
				data_mg.updateTime.update({"parentKey":"demo"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){console.log(errA)
						result.code=0
						}else{
							result.code=1
							}
						returnFn()
					})
				}
		})
		
};

function edit(socket,data,fn){
	console.log("demo/edit");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("demo_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
		console.log("更新demo")
	data_mg.demo.update({"id":data.data.id},{$set:data.data},{},function(err){
		if(err){console.log(err)
			result.code=0
			returnFn()
			}else{console.log("更新时间")
				data_mg.updateTime.update({"parentKey":"demo"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){console.log(errA)
						result.code=0
						}else{
							result.code=1
							}
						returnFn()
					})
				}
		})
		
};

function remove(socket,data,fn){
	console.log("demo/remove");
	
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("demo_remove",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
		}
	data_mg.demo.remove({"id":data.data},function(err){
		if(err){
			result.code=0
			returnFn()
			}else{
				data_mg.updateTime.update({"parentKey":"demo"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){
						result.code=0
						}else{
							result.code=1
							}
						returnFn()
					})
				}
		})
	
};

exports.get=get;
exports.add=add;
exports.edit=edit;
exports.remove=remove;