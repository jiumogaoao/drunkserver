var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	version:String,
	adminType:Array,
	expressID:Array,
	expressState:Array,
	goodType:Array,
	shopType:Array,
	provinceID:Array,
	cityID:Array,
	userType:Array
	});
module.exports = MemberSchema;