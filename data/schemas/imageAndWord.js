var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"name":String,/*名字*/
		"image":Array,/*头像*/
		"dsc":String,/*描述*/
		"job":String,/*职位*/
		"group":String,/*分组*/
		"data":Array/*子数据*/
	})
module.exports = MemberSchema;