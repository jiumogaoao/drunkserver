var mongoose = require('mongoose');
var memberSchema = require('../schemas/count');
var member = mongoose.model('count',memberSchema);
module.exports = member;