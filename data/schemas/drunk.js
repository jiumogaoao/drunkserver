var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({id:String,data:{}});
module.exports = MemberSchema;