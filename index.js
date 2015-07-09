//var server = require("./server");
//var router = require("./router");
//server.start(router.route);

var app = require('./server')
  , router = require('./router')
   , url = require("url")
   , query = require("querystring")
   , server = {
      demo : require('./demo')
   }

   var dbURL="mongodb://127.0.0.1:27017/talk"
   global.db = require("mongoose").connect(dbURL);
   global.data_mg = {}
      data_mg.demo = require('./data/models/demo');//商品表
      data_mg.updateTime = require('./data/models/updateTime');//更新表
	var showDB=function(){
		data_mg.demo.find({},function(err,data){console.log("demo")
			console.log(data)
			})
		data_mg.updateTime.find({},function(err,data){console.log("updateTime")
			console.log(data)
			})
		}
	var initDB=function(){
		var totalCount=0;
		function totalCheck(){
			totalCount++;
			if(totalCount==1){
				showDB();
				}
			}
	var demoUP=new data_mg.updateTime({"parentKey":"demo","childKey":"0"})
	    demoUP.save(function(){
			console.log("demoTime init");
			totalCheck();
			});
		}
	var emptyDB=function(){
		var totalCount=0;
		function totalCheck(){
			totalCount++;
			if(totalCount==2){
				initDB();
				}
			}
		
	data_mg.demo.remove({},function(){
			console.log("demo empty");
			totalCheck();
			});
	
	data_mg.updateTime.remove({},function(){
			console.log("updateTime empty");
			totalCheck();
			});
	
		}
	//emptyDB();	 
	showDB();


 	 var io = require('socket.io').listen(app.target)
app.target.listen(8888);
 
 io.sockets.on('connection', function (socket) {
 	console.log("连上了");
   socket.emit('connected', { hello: 'world' });
   socket.on('server',function(data){
   		if(data&&data.model&&data.action&&server[data.model]&&server[data.model][data.action]){
   			server[data.model][data.action](socket,data);
   		}
   	});


 });