//var server = require("./server");
//var router = require("./router");
//server.start(router.route);

var app = require('./server')
  , router = require('./router')
   , url = require("url")
   , query = require("querystring")
   global.server = {
   	deal : require('./deal'),
      admin : require('./admin'),
      client : require('./client'),
      product : require('./product'),
      promotion : require('./promotion'),
	  config : require('./config'),
	  obj : require('./obj'),
	  type : require('./type'),
	  com : require('./com'),
	  borrow : require('./borrow'),
	  message: require('./message'),
	  broadcast: require('./broadcast')
   }
/**********************************************************************************/
   var dbURL="mongodb://127.0.0.1:27017/xiaoyiwo"
   global.db = require("mongoose").connect(dbURL);
   global.data_mg = {}
      data_mg.admin = require('./data/models/admin');//管理员表
      data_mg.client = require('./data/models/client');//客户表
      data_mg.client_password = require('./data/models/client_password');//密码表
      data_mg.client_product = require('./data/models/client_product');//购买表
      data_mg.product = require('./data/models/product');//商品表
      data_mg.promotion = require('./data/models/promotion');//宣传表
      data_mg.updateTime = require('./data/models/updateTime');//更新表
      data_mg.deal = require('./data/models/deal');//交易表
	  data_mg.bindCode = require('./data/models/bindCode');//验证码表
	  data_mg.config = require('./data/models/config');//配置表
	  data_mg.invite = require('./data/models/invite');//邀请表
	  data_mg.account = require('./data/models/account');//帐户表
	  data_mg.obj = require('./data/models/obj');//类型表
	  data_mg.type = require('./data/models/type');//标签表
	  data_mg.com = require('./data/models/com');//评论表
	  data_mg.realName = require('./data/models/realName');//实名制表
	  data_mg.cardBind = require('./data/models/cardBind');//银行卡表
	  data_mg.redPacket = require('./data/models/redPacket');//红包表
	  data_mg.count = require('./data/models/count');//数据统计表
	  data_mg.company = require('./data/models/company');//企业信息表
	  data_mg.borrow=require('./data/models/borrow');//借贷表
	  data_mg.broadcast=require('./data/models/broadcast');//公告表
	  data_mg.message=require('./data/models/message');//对话表
/***********************************************************************************/
	global.uuid=function(){
		return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	        return (v.toString(16)).toUpperCase();
    	});
	}
/***********************************************************************************/
	global.tokenArry={}; 
/***********************************************************************************/
var showDB=function(){
		data_mg.product.find({},function(err,data){console.log("product")
			console.log(data)
			})
		data_mg.obj.find({},function(err,data){console.log("obj")
			console.log(data)
			})
		data_mg.type.find({},function(err,data){console.log("type")
			console.log(data)
			})
		data_mg.com.find({},function(err,data){console.log("com")
			console.log(data)
			})
		data_mg.realName.find({},function(err,data){console.log("realName")
			console.log(data)
			})
		data_mg.cardBind.find({},function(err,data){console.log("cardBind")
			console.log(data)
			})
		data_mg.updateTime.find({},function(err,data){console.log("updateTime")
			console.log(data)
			})
}
/****************************************************************************************/	 
var initDB=function(){
		var totalCount=0;
		function totalCheck(){
			totalCount++;
			if(totalCount==10){
				showDB();
				}
			}
		var addConfig=new data_mg.config({
		any:{
			logo:"img/name.png",
			name:"星众筹",
			phone:"400-816-5151[24h]",
			mail:"51service@51wofang.com",
			businessMail:"51bd@51wofang.com",
			place:"北京市东城区万国城MOMA8号楼3楼",
			wx:"img/qr.png",
			wb:"img/qr.png",
			icp:"京ICP备15017470号-2",
			host:"2016 51wofang.com"
		}
     })
	 	addConfig.save(
		function(){
			console.log("config init");
			totalCheck();
			}
		)
	 	var configUP=new data_mg.updateTime({"parentKey":"config","childKey":0})
	    configUP.save(function(){
			console.log("configTime init");
			totalCheck();
			});

		var messageUP=new data_mg.updateTime({"parentKey":"message","childKey":0})
	    messageUP.save(function(){
			console.log("messageTime init");
			totalCheck();
			});

	    var broadcastUP=new data_mg.updateTime({"parentKey":"broadcast","childKey":0})
	    broadcastUP.save(function(){
			console.log("broadcastTime init");
			totalCheck();
			});

		var newTotal=new data_mg.count({
		"name":"totalView",//图片id
		"number":0,//路径
		});
		newTotal.save(function(){
			console.log("Total init");
			totalCheck();
		});
		var addAdmin=new data_mg.client({"id":"001",/*id*/
		"type":2,/*类型,1普通用户2管理用户*/
		"userName":"admin",/*用户名*/
		"image":"",/*头像*/
		"dsc":"",/*简介*/
		"phone":0,/*手机*/
		"email":"",/*邮箱*/
		"introducer":"",/*介绍人*/
		"lastTime":0,/*上次登录时间*/
		"lastIp":"",/*上次登录IP*/
		"time":0,/*当前登录时间*/
		"balance":0,
		"redpacket":0,
		"ip":""/*当前登录ip*/});
		addAdmin.save(function(){
			console.log("addAdmin init");
			totalCheck();
			});
		var adminPass=new data_mg.client_password({"parentKey":"001",
		"childKey":"123456"});
		adminPass.save(function(){
			console.log("adminPass init");
			totalCheck();
			});
		var addPromo0=new data_mg.promotion({"any":{
			"001":{"id":"001","name":"商城轮播","list":{}},
			"002":{"id":"002","name":"商城轮播底部","list":{}},
			"003":{"id":"003","name":"合作伙伴","list":{}},
			"004":{"id":"004","name":"借贷首页","list":{}}
		}})
		addPromo0.save(function(){
			console.log("Promo init");
			totalCheck();
			});
		var addObj0=new data_mg.obj({list:[]})
		addObj0.save(function(){
			console.log("Obj0 init");
			totalCheck();
			});
		/****************************************************************************/

		var addproductT=new data_mg.updateTime({"parentKey":"product","childKey":0})
		addproductT.save(function(){
			console.log("productTime init");
			totalCheck();
			});
		var addObjT=new data_mg.updateTime({"parentKey":"obj","childKey":new Date().getTime()})
		addObjT.save(function(){
			console.log("objTime init");
			totalCheck();
			});
		var addTypeT=new data_mg.updateTime({"parentKey":"type","childKey":new Date().getTime()})
		addTypeT.save(function(){
			console.log("typeTime init");
			totalCheck();
			});
		var addComT=new data_mg.updateTime({"parentKey":"com","childKey":0})
		addComT.save(function(){
			console.log("comTime init");
			totalCheck();
			});
		var addClientT=new data_mg.updateTime({"parentKey":"client","childKey":0})
		addClientT.save(function(){
			console.log("clientTime init");
			totalCheck();
			});
		var addRealNameT=new data_mg.updateTime({"parentKey":"realName","childKey":0})
		addRealNameT.save(function(){
			console.log("realNameTime init");
			totalCheck();
			});
		var addCompanyT=new data_mg.updateTime({"parentKey":"company","childKey":0})
		addCompanyT.save(function(){
			console.log("companyTime init");
			totalCheck();
			});
		var addCardBindT=new data_mg.updateTime({"parentKey":"cardBind","childKey":0})
		addCardBindT.save(function(){
			console.log("cardBindTime init");
			totalCheck();
			});
		var addPromoT=new data_mg.updateTime({"parentKey":"promotion","childKey":new Date().getTime()})
		addPromoT.save(function(){
			console.log("promoTime init");
			totalCheck();
			});
		var addBorrowT=new data_mg.updateTime({"parentKey":"borrow","childKey":0})
		addBorrowT.save(function(){
			console.log("borrow init");
			totalCheck();
			});
}
/***********************************************************************************/
var emptyDB=function(){
		var totalCount=0;
		function totalCheck(){
			totalCount++;
			if(totalCount==18){
				initDB();
				}
			}
		data_mg.product.remove({},function(){
			console.log("product empty");
			totalCheck();
			});
		data_mg.obj.remove({},function(){
			console.log("obj empty");
			totalCheck();
			});
		data_mg.type.remove({},function(){
			console.log("type empty");
			totalCheck();
			});
		data_mg.com.remove({},function(){
			console.log("com empty");
			totalCheck();
			});
		data_mg.client.remove({},function(){
			console.log("client empty");
			totalCheck();
			});
		data_mg.realName.remove({},function(){
			console.log("realName empty");
			totalCheck();
			});
		data_mg.company.remove({},function(){
			console.log("company empty");
			totalCheck();
			});
		data_mg.cardBind.remove({},function(){
			console.log("cardBind empty");
			totalCheck();
			});
		data_mg.account.remove({},function(){
			console.log("account empty");
			totalCheck();
			});
		data_mg.client_password.remove({},function(){
			console.log("client_password empty");
			totalCheck();
			});
		data_mg.invite.remove({},function(){
			console.log("invite empty");
			totalCheck();
			});
		data_mg.redPacket.remove({},function(){
			console.log("redPacket empty");
			totalCheck();
			});
		data_mg.promotion.remove({},function(){
			console.log("promotion empty");
			totalCheck();
			});
		data_mg.count.remove({},function(){
			console.log("count empty");
			totalCheck();
			});
		data_mg.config.remove({},function(){
			console.log("config empty");
			totalCheck();
			});
		data_mg.updateTime.remove({},function(){
			console.log("updateTime empty");
			totalCheck();
			});
		data_mg.borrow.remove({},function(){
			console.log("borrow empty");
			totalCheck();
			});
		data_mg.deal.remove({},function(){
			console.log("deal empty");
			totalCheck();
			});
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