var type={}
type.add=function(socket,data){
	function noType(){
		var newType=new data_mg.type({name:data.name,icon:data.icon,dsc:data.dsc,subType:[]});
		newType.save(function(err,doc){
			if(err){
				console.log(err);
				socket.emit("err",{errDsc:"获取类型数据错误"});
			}else{
				io.sockets.emit("typeAdd",doc);
			}
		});
	}
	data_mg.type.findOne({name:data.name},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取类型数据错误"});
		}else if(doc){
			socket.emit("err",{errDsc:"类型重名"});
		}else{
			noType();
		}
	})
}

type.remove=function(socket,data){
	data_mg.type.remove({_id:data._id},function(err){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"删除类型错误"});
		}else{
			io.sockets.emit("typeRemove",data);
		}
	});

type.change=function(socket,data){
	data_mg.type.update({_id:data._id},{$set:data},function(err){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"修改类型错误"});
		}else{
			io.sockets.emit("typeChange",data);
		}
	});
}

module.exports=type;