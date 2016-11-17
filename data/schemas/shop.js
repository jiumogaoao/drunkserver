var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	id:String,
	name:String,
	icon:String,
	background:String,
	dsc:String,
	provinceID:String,
	cityID:String,
	email:String,
	type:String,
	visitCount:Number,
	shellCount:Number,
	shellList:Array
	});
module.exports = MemberSchema;