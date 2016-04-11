var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"userid":String,/*帐号*/
		"money":Number,/*金额*/
		"type":String,/*0充值1提现*/
		"time":Number,/*时间*/
		"state":String/*0进行中1已完成*/
	})
module.exports = MemberSchema;