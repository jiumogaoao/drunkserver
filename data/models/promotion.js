var mongoose = require('mongoose');
var memberSchema = require('../schemas/promo');
var member = mongoose.model('promotion',memberSchema);
module.exports = member;