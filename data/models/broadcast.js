var mongoose = require('mongoose');
var memberSchema = require('../schemas/broadcast');
var member = mongoose.model('broadcast',memberSchema);
module.exports = member;