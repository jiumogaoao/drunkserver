var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"title":String,/*商品名*/
		"image":Array,/*图片*/
		"brand":String,/*品牌*/
		"stratTime":Number,/*上架时间*/
		"endTime":Number,/*下架时间*/
		"dsc":String,//简介
		"goodState":Array,//商品属性
		"object":Array,/*栏目*/
		"type":Array,/*栏目类型*/
		"place":String,/*发货地*/
		"detail":String,/*详情*/
		"priceState":Array,/*自定义属性[{title:"",id:"",list:[{id:"",name:"",icon:""}]}]*/
		"model":{},/*型号id:{price:0,count:0,state:[0,1]}*/
		"member":Array,
		"shopId":String,/*商户Id*/
		"star":Number,/*好评数*/
		"price":Array,/*价格*/
		"recommend":String,/*推荐*/
		"tag":Array,/*标签*/
		"state":String,/*0未审核1已通过2未通过*/
		"visit":Number,/*浏览数*/
		"shopType":String/*商品分类*/
	})
module.exports = MemberSchema;