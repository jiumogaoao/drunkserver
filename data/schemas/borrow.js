var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"user":String,/*用户id*/
		"image":String,/*用户头像*/
		"linkMan":String,/*联系人*/
		"birthday":Number,/*生日*/
		"workPlace":String,/*工作地点*/
		"census":String,/*户籍*/
		"pay":String,/*月薪*/
		"house":String,/*房贷*/
		"car":String,/*车贷*/
		"card":String,/*身份证号*/
		"phone":String,/*联系手机*/
		"money":Number,/*借款金额*/
		"state":Number/*状态*/
	})
module.exports = MemberSchema;