// JavaScript Document
var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"userId":String,/*用户id*/
		"shopId":String,/*派发商家id*/
		"money":Number,/*金额*/
		"type":Number,/*类型*/
		"strat":Number,/*发放日期*/
		"end":Number/*消费日期*/
	})
module.exports = MemberSchema;