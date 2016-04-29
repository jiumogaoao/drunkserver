var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	id:String,
	name:String,
	icon:String,
	dsc:String,
	user:String,
	type:Number,
	time:Number,
	list:Array
	});
module.exports = MemberSchema;