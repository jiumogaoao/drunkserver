   var dbURL="mongodb://127.0.0.1:27017/pinleGao"
   global.db = require("mongoose").connect(dbURL);
   global.version = "0.0.0.0";
   global.data_mg = {};
   data_mg.user = require('./data/models/user');
   data_mg.admin = require('./data/models/admin');
   data_mg.config = require('./data/models/config');
   data_mg.express = require('./data/models/express');
   data_mg.good = require('./data/models/good');
   data_mg.shop = require('./data/models/shop');
/**********************************************************************************/   
var app = require('./server')
  , router = require('./router')
   , url = require("url")
   , query = require("querystring"),
   crypto = require('crypto'),
   nodemailer = require("nodemailer");
   global._ = require("underscore")._;
  global.moment=require('moment');
/***********************************************************************************/
	global.tool = {};

  tool.images = require('./tool/images');
 /**********************************************************************************/ 
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
	tool.sendEmail=require('./tool/sendEmail');
/***********************************************************************************/
tool.factory=require('./tool/factory');
/***********************************************************************************/
tool.socket=function(toArry,eventName,data){
  var sendArry=_.filter(tokenArry,function(point){
      return point.user&&_.some(toArry,function(to){
        return to===point.user.id;
      });
  });
  _.each(sendArry,function(send){
    if(send.socket){
      send.socket.emit('event',{
        eventName:eventName,
        data:data
      });
    }
  })
};
/***********************************************************************************/
	global.tokenArry={}; 
/************************************************************************/
   global.server = {
    user : require('./dao/user'),
    admin : require('./dao/admin'),
   config : require('./dao/config'),
   express : require('./dao/express'),
   good : require('./dao/good'),
   shop : require('./dao/shop')
   }
/***********************************************************************************/
var showDB=function(){
  _.each(data_mg,function(val,index){
    console.log(index+":");
    val.find({},function(err,doc){
      console.log(doc)
    })
  });
  readyDB();
}
/***********************************************************************************/
var emptyDB=function(){
  var count=0;
  var emptyCallback=function(){
    count++;
    if(count==_.size(data_mg)){
      initDB();
    }
  }
  _.each(data_mg,function(val,index){
    val.remove({},function(err){
      console.log(index+":remove");
      emptyCallback();
    });
  })
}
/**********************************************************************************/
var initDB=function(){
    var count=0;
    var initCallback=function(){
      count++;
      if(count==2){
        readyDB();
      }
    }
    var initAdmin = new data_mg.admin({id:"0000",name:"admin",key:"##jiumo86;;",type:0});
    initAdmin.save(function(){
      console.log("admin:ready");
      initCallback();
    });
    var initConfig = new data_mg.config({
      version:"0.0.0.0",
      adminType:["超级管理员"],
      expressID:[],
      expressState:["待支付","待发货","待揽件","待收货","已收货","退货"],
      goodType:["杂货"],
      shopType:["杂货"],
      provinceID:[{id:"000",name:"广东"}],
      cityID:[{id:"000",name:"广州"}],
      userType:["游客","买家","卖家"]
    });
    initConfig.save(function(){
      console.log("config:ready");
      initCallback();
    });
}
/***********************************************************************************/
var readyDB=function(){
      app.target.listen(8888);
    console.log("Server has started.");
  /***********************************************************************************/ 
     var io = require('socket.io').listen(app.target)
   io.sockets.on('connection', function (socket) {
    console.log("连上了");
     socket.emit('connected', { hello: 'world' });
     socket.on('tk',function(data){
      tokenArry[data.tk].socket=socket;
      console.log('tk注册成功');
     });
     socket.on('server',function(data){
        if(data&&data.model&&data.action&&server[data.model]&&server[data.model][data.action]){
          server[data.model][data.action](socket,data);
        }
      });
   });
}
	emptyDB();
  //showDB();
