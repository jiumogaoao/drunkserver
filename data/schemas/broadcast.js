var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"message":String,/*内容*/
		"start":Number,/*发出时间*/
		"end":Number,/*有效时间*/
		"title":String/*标题*/
	})
module.exports = MemberSchema;