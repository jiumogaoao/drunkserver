var mongoose = require('mongoose');
var memberSchema = require('../schemas/member');
var member = mongoose.model('client',memberSchema);
module.exports = member;