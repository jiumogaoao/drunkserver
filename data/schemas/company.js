var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"name":String,/*公司名*/
		"place":String,/*地区*/
		"money":Number,/*注册资金*/
		"email":String,/*邮箱*/
		"type":String,/*企业类型*/
		"linkMan":String,/*联系人*/
		"linkPhone":String,/*联系电话*/
		"cardNumber":String,/*执照号*/
		"state":Number/*审核状态*/
	})
module.exports = MemberSchema;