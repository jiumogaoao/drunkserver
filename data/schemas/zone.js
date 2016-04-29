var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	id:String,
	type:Number,
	time:Number,
	icon:String,
	name:String,
	user:String,
	text:String,
	pic:String,
	praise:Array,
	attention:Array,
	readed:Array,
	share:Array,
	reply:Array
	});
module.exports = MemberSchema;