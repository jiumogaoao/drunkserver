var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"inviter":String,/*邀请人id*/
		"user":String,/*被邀请人id*/
		"money":Number,/*奖金*/
		"type":Number/*类型0注册邀请1购买邀请*/
	})
module.exports = MemberSchema;