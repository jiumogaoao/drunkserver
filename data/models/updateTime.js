var mongoose = require('mongoose');
var memberSchema = require('../schemas/link');
var member = mongoose.model('updateTime',memberSchema);
module.exports = member;