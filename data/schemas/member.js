var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"type":Number,/*类型,1普通用户2管理用户3商户*/
		"userName":String,/*用户名*/
		"image":String,/*头像*/
		"phone":String,/*手机*/
		"email":String,/*邮箱*/
		"dsc":String,/*简介*/
		"introducer":String,/*介绍人*/
		"lastTime":Number,/*上次登录时间*/
		"lastIp":String,/*上次登录IP*/
		"time":Number,/*当前登录时间*/
		"ip":String,/*当前登录ip*/
		"balance":Number,/*余额*/
		"redpacket":Number,/*红包*/
		"shopList":{},/*购物车*/
		"star":Number,/*好评数*/
		"shopName":String,/*店名*/
		"shopIcon":String,/*店铺logo*/
		"shopBanner":String,/*店铺banner*/
		"shopDesc":String,/*店铺简介*/
		"shopPlace":String,/*店铺地点*/
		"shopType":Array,/*商品分类*/
		"visit":Number,/*人气*/
		"realName":Number,/*实名认证，0未认证，1已认证*/
		"card":Number,/*银行卡认证，0未认证，1已认证*/
		"company":Number,/*企业信息认证，0未认证，1已认证*/
		"shop":Number,/*店铺信息认证，0未认证，1已认证*/
		"collectShop":{},/*店铺收藏*/
		"collectProduct":{},/*商品收藏*/
		"wantOpen":Number
	})
module.exports = MemberSchema;