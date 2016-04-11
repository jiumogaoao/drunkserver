var mongoose = require('mongoose');
var memberSchema = require('../schemas/realName');
var member = mongoose.model('realName',memberSchema);
module.exports = member;