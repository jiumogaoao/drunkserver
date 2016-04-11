var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,
		"userId":String,
		"shopId":String,
		"productId":String,
		"main":String,
		"userHead":String,
		"userName":String
	})
module.exports = MemberSchema;