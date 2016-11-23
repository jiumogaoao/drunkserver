var mongoose = require('mongoose');
var memberSchema = require('../schemas/type');
var member = mongoose.model('type',memberSchema);
module.exports = member;