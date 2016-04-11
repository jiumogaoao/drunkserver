var mongoose = require('mongoose');
var memberSchema = require('../schemas/message');
var member = mongoose.model('message',memberSchema);
module.exports = member;