var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	id:String,
	name:String,
	dsc:String,
	member:Array
	});
module.exports = MemberSchema;