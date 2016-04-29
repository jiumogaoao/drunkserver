var mongoose = require('mongoose');
var memberSchema = require('../schemas/talkGroup');
var member = mongoose.model('talkGroup',memberSchema);
module.exports = member;