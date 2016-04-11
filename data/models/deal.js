var mongoose = require('mongoose');
var memberSchema = require('../schemas/deal');
var member = mongoose.model('deal',memberSchema);
module.exports = member;