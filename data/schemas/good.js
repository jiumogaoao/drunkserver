var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	shop:String,
	name:String,
	icon:String,
	photo:Array,
	dsc:String,
	detail:String,
	count:Number,
	price:Number,
	type:String,
	shellCount:Number,
	visitCount:Number,
	start:Number,
	end:Number,
	parame:Array
	});
module.exports = MemberSchema;