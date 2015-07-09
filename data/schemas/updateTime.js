var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,//图片id
		"model":String,//路径
		"time":Number
		})
module.exports = MemberSchema;