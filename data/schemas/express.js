var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	user:String,
	goodList:Array,
	state:Number,
	stateList:Array,
	expressCompany:String,
	expressID:String,
	updataTime:Number,
	total:Number,
	shopList:Array,
	provinceID:String,
	cityID:String,
	place:String,
	phone:String,
	name:String
	});
module.exports = MemberSchema;