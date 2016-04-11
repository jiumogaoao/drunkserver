var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"userName":String,/*帐号*/
		"client":String,/*用户管理*/
		"admin":String,/*管理员管理*/
		"announcement":String,/*公告管理*/
		"recruit":String,/*招聘管理*/
		"company":String,/*企业信息管理*/
		"product":String,/*商品管理*/
		"promotion":String,/*宣传管理*/
		"redPacket":String/*红包管理*/
	})
module.exports = MemberSchema;