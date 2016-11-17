var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	goodList:Array,
	state:Number,
	stateList:Array,
	expressCompany:String,
	expressID:String,
	updataTime:Number
	});
module.exports = MemberSchema;