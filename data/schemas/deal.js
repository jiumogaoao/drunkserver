var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"product":Array,/*商品*/
		"userId":String,/*用户id*/
		"shopId":String,/*商户Id*/
		"startTime":Number,/*购买时间*/
		"shopName":String,/*商家名*/
		"name":String,/*用户名*/
		"phone":String,/*用户手机号*/
		"state":Number,/*0没支付,1已支付,没发货,2已发货,3已收货,4已评价,5已取消6退货*/
		"logistics":String,/*物流*/
		"logNumber":String,/*物流单号*/
		"star":Number,/*评分*/
		"com":String,/*评价*/
		"comTime":Number,/*评价时间*/
		"totalPrice":Number,/*总价*/
		"dealName":String,
		"dealPhone":String,
		"dealPlace":String
	})
module.exports = MemberSchema;