var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"name":String,/*开户名*/
		"number":String,/*银行卡*/
		"place":String,/*开户城市*/
		"bank":String,/*开户支行*/
		"state":Number/*审核状态*/
	})
module.exports = MemberSchema;