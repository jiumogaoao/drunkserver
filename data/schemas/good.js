var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	shop:String,
	shopName:String,
	name:String,
	icon:String,
	photo:Array,
	dsc:String,
	detail:String,
	overplus:Number,
	price:Number,
	type:String,
	subType:String,
	shellCount:Number,
	visitCount:Number,
	start:Number,
	end:Number,
	parame:Array
	});
module.exports = MemberSchema;