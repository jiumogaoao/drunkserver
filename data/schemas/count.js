var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"name":String,//图片id
		"number":Number,//路径
		})
module.exports = MemberSchema;