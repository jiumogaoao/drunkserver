var mongoose = require('mongoose');
var memberSchema = require('../schemas/borrow');
var member = mongoose.model('borrow',memberSchema);
module.exports = member;