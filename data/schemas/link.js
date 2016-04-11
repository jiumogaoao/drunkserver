var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"parentKey":String,//图片id
		"childKey":String,//路径
		})
module.exports = MemberSchema;