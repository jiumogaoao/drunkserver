var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	id:String,
	name:String,
	dsc:String,
	icon:String,
	type:Number,
	file:Array,
	album:Array,
	publics:String,
	action:Array,
	sign:Array,
	vote:Array,
	link:String,
	app:Array,
	member:Array
	});
module.exports = MemberSchema;