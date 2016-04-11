var mongoose = require('mongoose');
var memberSchema = require('../schemas/saveQuestion');
var member = mongoose.model('saveQuestion',memberSchema);
module.exports = member;