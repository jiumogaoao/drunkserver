var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	id:String,
	time:Number,
	from:String,
	name:String,
	icon:String,
	to:String,
	state:Number,
	type:String,
	main:String,
	readed:Boolean
	});
module.exports = MemberSchema;