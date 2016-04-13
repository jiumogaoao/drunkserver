//var server = require("./server");
//var router = require("./router");
//server.start(router.route);

   var dbURL="mongodb://127.0.0.1:27017/drunk"
   global.db = require("mongoose").connect(dbURL);
   global.data_mg = {}
   data_mg = require('./data/models/drunk');
/**********************************************************************************/   
var app = require('./server')
  , router = require('./router')
   , url = require("url")
   , query = require("querystring"),
   crypto = require('crypto'),
   nodemailer = require("nodemailer");
	global._ = require("underscore")._;
/***********************************************************************************/
	global.tool = {};
	tool.uuid=function(){
		return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	        return (v.toString(16)).toUpperCase();
    	});
	}
/**********************************************************************************/
	tool.md5=function(str){
		var md5 = crypto.createHash('md5');
			md5.update(str);
		return md5.digest('hex');
	}
/***********************************************************************************/
	tool.sendEmail=function(to,title,text,html,callback){
// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: '394127821@qq.com',
        pass: 'jiumogaoao86'
    }
});
		var mailOptions = {
  from: "jiumogaoao<394127821@qq.com>", // 发件地址
  to: to, // 收件列表
  subject: title, // 标题
  text: text,
  html: html // html 内容
}
// 发送邮件
smtpTransport.sendMail(mailOptions, function(error, info){
  if(error){
    console.log(error);
	if(callback){
		callback(false);
	}
  }else{
    console.log("Message sent: " + info.response);
	if(callback){
		callback(true);
	}
  }
  smtpTransport.close(); // 如果没用，关闭连接池
});
}
/***********************************************************************************/
tool.factory=function(exports,modelName,actionName,mainFn,linkModel,linkAction){
  if(!exports||!modelName||!actionName||!mainFn){
    return false;
  }
  var main=function(socket,data,fn,end){
      console.log(modelName+"/"+actionName);
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
        socket.emit(modelName+"_"+actionName,result);
       }
        else if(fn){
          var returnString = JSON.stringify(result);
          fn(returnString);
        }
      }
      function errFn(err,message){
        result.success=false;
        console.log(err);
        result.message=message;
        returnFn();
      }
      function successFn(returnData){
          console.log("linkModel"+linkModel);
          console.log("linkAction"+linkAction);
          if(linkModel&&linkAction){
            if(end){
            result.data=returnData;
            result.success=true;
            result.code=1;
            result.time=new Date().getTime();
            console.log(result)
            returnFn();
          }else{
            server[linkModel][linkAction](socket,data,fn,true);  
          }
        }else{
          result.data=returnData;
            result.success=true;
            result.code=1;
            result.time=new Date().getTime();
            console.log(result)
            returnFn();
        }
      }
      mainFn(data.data,successFn,errFn);
  }
  exports[actionName]=function(socket,data,fn,end){console.log(9)
    main(socket,data,fn,end);
  }
}
/***********************************************************************************/
	global.tokenArry={}; 
/************************************************************************/
   global.server = {
    user : require('./user'),
      group : require('./group'),
      album : require('./album'),
      message : require('./message'),
      zone : require('./zone')
   }
/***********************************************************************************/
var showDB=function(){

}
/****************************************************************************************/	 
var initDB=function(){

}
/***********************************************************************************/
var emptyDB=function(){

}
	//emptyDB();
	showDB();
/***********************************************************************************/	
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