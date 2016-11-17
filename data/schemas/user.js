var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
	userName:String,
	name:String,
	phone:String,
	key:String,
	icon:String,
	background:String,
	dsc:String,
	sex:Number,
	provinceID:String,
	cityID:String,
	birthday:Number,
	email:String,
	place:Array,
	type:Number,
	balance:Number,
	balanceList:Array,
	shoppingCart:Array,
	buyList:Array
	});
module.exports = MemberSchema;