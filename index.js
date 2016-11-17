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

  tool.images = function(img,name,size){
    if(!size.length){
      return false;
    }
    size = _.sortBy(size,function(point){return -1*point});
    var newId = tool.uuid();
    var src = images(img);
    _.each(size,function(point){
      src.resize(point).save(name+"_"+newId+"_"+point+".jpg",{operation:100});
    });
    return name+"_"+newId;
  }
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
tool.factory=function(request,exports,modelName,actionName,mainFn,linkModel,linkAction,reactive){
  if(!exports||!modelName||!actionName||!mainFn){
    return false;
  }
  var main=function(socket,data,fn,end,reactiveData){
      console.log("reactiveData:"+reactiveData);
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
	  function scFn(returnData){
            if(linkModel&&linkAction){
                if(end){
                if(reactive){
                  result.data=reactiveData;
                }else{
                  result.data=returnData;
                }
                result.success=true;
                result.code=1;
                result.time=new Date().getTime();
                console.log(result)
                returnFn();
              }else{
                var activeData={};
                if(!reactive){
                  activeData=returnData;
                }
                server[linkModel][linkAction](socket,data,fn,true,activeData);  
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
      function successFn(returnData,cache){
        if(_.size(cache)){
          var total=_.size(cache);
          var totalCount=0;
          function saveSC(err,doc){
            if(err){
              result.success=false;
              console.log(err);
              result.message=message;
              returnFn();
            }else{
              totalCount++;
              if(total==totalCount){
                scFn(returnData);
              }
            }
          }
          _.each(cache,function(point){
            point.save(saveSC);
          });
        }else{
          scFn(returnData);
        }
      }
      var cache={};
      if(!request){
         mainFn(cache,data.data,successFn,errFn);
       }else{
		var newRequest=(function(data){
       return eval('('+request+')');
    })(data.data);
        data_mg[modelName].find(newRequest,function(err,doc){
			if(!err){
				cache=_.indexBy(doc,"id");
				mainFn(cache,data.data,successFn,errFn);
				}else{
					errFn(err);
					}
        });
       }
  }
  exports[actionName]=function(socket,data,fn,end,reactiveData){
    main(socket,data,fn,end,reactiveData);
  }
}
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
 //  global.server = {
 //   user : require('./user'),
 //     group : require('./group'),
 //     album : require('./album'),
 //     message : require('./message'),
 //     zone : require('./zone'),
 //     talkGroup : require('./talkGroup')
 //  }
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
      console.log("admin:config");
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
