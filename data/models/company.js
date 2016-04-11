var mongoose = require('mongoose');
var memberSchema = require('../schemas/company');
var member = mongoose.model('company',memberSchema);
module.exports = member;