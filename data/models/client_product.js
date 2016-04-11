var mongoose = require('mongoose');
var memberSchema = require('../schemas/link');
var member = mongoose.model('client_product',memberSchema);
module.exports = member;