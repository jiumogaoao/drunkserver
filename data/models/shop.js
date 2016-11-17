var mongoose = require('mongoose');
var memberSchema = require('../schemas/shop');
var member = mongoose.model('shop',memberSchema);
module.exports = member;