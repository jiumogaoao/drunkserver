var mongoose = require('mongoose');
var memberSchema = require('../schemas/user');
var member = mongoose.model('user',memberSchema);
module.exports = member;