var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	name:String,
	icon:String,
	dsc:String,
	subType:Array
	});
module.exports = MemberSchema;