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
   data_mg.type = require('./data/models/type');
/**********************************************************************************/   
var app = require('./server')
 // , router = require('./router')
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
	global.loginArry={}; 
/************************************************************************/
   global.server = {
    user : require('./dao/user'),
    admin : require('./dao/admin'),
   config : require('./dao/config'),
   express : require('./dao/express'),
   good : require('./dao/good'),
   shop : require('./dao/shop'),
   type : require('./dao/type')
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
    val.remove({},function(err)
      {
        if(err){
            console.log(index+"err:");
            console.log(err);
        }else{
            console.log(index+":remove");
            emptyCallback();
        }
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
    var initAdmin = new data_mg.admin({name:"admin",key:"##jiumo86;;",type:"0"});
    initAdmin.save(function(err){
      if(err){
        console.log("admin init err:");
        console.log(err);
      }else{
        console.log("admin:ready");
        initCallback();
      } 
    });
    var initConfig = new data_mg.config({
      version:"0.0.0.0",
      adminType:[{name:"超级管理员"}],
      expressID:[{id:"001",name:"某个快递"}],
      expressState:[{name:"待支付"},{name:"待发货"},{name:"待揽件"},{name:"待收货"},{name:"已收货"},{name:"退货申请"},{name:"待退货"},{name:"退货待确认"},{name:"退货成功"},{name:"订单取消"}],
      provinceID:[{id:"000",name:"广东"}],
      cityID:[{id:"000",name:"广州"}],
      userType:[{name:"游客"},{name:"买家"},{name:"卖家"}]
    });
    initConfig.save(function(err){
      if(err){
        console.log("config init err:");
        console.log(err);
      }else{
        console.log("config:ready");
        initCallback();
      }
    });
}
/***********************************************************************************/
var readyDB=function(){
      app.target.listen(8888);
    console.log("Server has started.");
  /***********************************************************************************/ 
   global.io = require('socket.io').listen(app.target)
   io.sockets.on('connection', function (socket) {
    console.log("连上了");
     socket.emit('connected',  {'connected':true} );
     
     socket.on('server',function(data){
        if(data&&data.model&&data.action&&server[data.model]&&server[data.model][data.action]){
          server[data.model][data.action](socket,data.data);
        }
      });
     data_mg.config.findOne({version:version},function(err,doc){
        if(err){
          socket.emit("err",{errDsc:"获取配置信息错误"});
        }else{
          socket.emit("config",doc);
        }
     });
     data_mg.type.find({},function(err,docs){
        if(err){
          socket.emit("err",{errDsc:"获取类型错误"});
        }else{
          socket.emit("type",docs);
        }
     });
     socket.on('tk',  function(data){
        _.each(global.loginArry,function(val){
          if(val.tk==data.tk){
            socket.userId=val.userId;
            val.socket=socket;
            if(val.admin){
              socket.join('admin');
              socket.emit('tk',{tk:data.tk});
            }else{
              socket.join('user');
              socket.emit('tk',{tk:data.tk,user:val.user});
              data_mg.express.find({$or:[{user:socket.userId},{shop:socket.userId}]},function(err.doc){
                if(err){
                  socket.emit("err",{errDsc:"获取交易信息错误"});
                }else{
                  socket.emit("express",docs);
                }
              })
            }
            
          }
        })
     } );
   });
   
}
	//emptyDB();
  showDB();
