var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	name:String,
	key:String,
	type:Number
	});
module.exports = MemberSchema;