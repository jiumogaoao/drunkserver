var mongoose = require('mongoose');
var memberSchema = require('../schemas/product');
var member = mongoose.model('product',memberSchema);
module.exports = member;