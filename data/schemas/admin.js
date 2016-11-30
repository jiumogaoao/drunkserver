var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	name:String,
	key:String,
	type:String
	});
module.exports = MemberSchema;