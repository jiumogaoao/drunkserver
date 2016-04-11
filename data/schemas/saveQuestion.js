var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,
		"question1":String,
		"question2":String,
		"answer1":String,
		"answer2":String
		})
module.exports = MemberSchema;