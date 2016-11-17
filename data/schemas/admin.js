var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	id:String,
	name:String,
	key:String,
	type:Number
	});
module.exports = MemberSchema;