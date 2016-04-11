var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"message":String,/*内容*/
		"time":Number,/*发出时间*/
		"from":String,/*发出id*/
		"to":String,/*接收id*/
		"readed":Boolean,/*已读*/
		"fromName":String,
		"toName":String
	})
module.exports = MemberSchema;