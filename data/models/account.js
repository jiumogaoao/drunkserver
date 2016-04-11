var mongoose = require('mongoose');
var memberSchema = require('../schemas/account');
var member = mongoose.model('account',memberSchema);
module.exports = member;