var mongoose = require('mongoose');
var memberSchema = require('../schemas/idName');
var member = mongoose.model('type',memberSchema);
module.exports = member;