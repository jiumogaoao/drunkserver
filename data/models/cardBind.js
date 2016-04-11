var mongoose = require('mongoose');
var memberSchema = require('../schemas/cardBind');
var member = mongoose.model('cardBind',memberSchema);
module.exports = member;