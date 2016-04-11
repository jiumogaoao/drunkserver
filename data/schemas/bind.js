var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"phone":Boolean,
		"email":Boolean
	})
module.exports = MemberSchema;