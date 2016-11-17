var mongoose = require('mongoose');
var memberSchema = require('../schemas/config');
var member = mongoose.model('config',memberSchema);
module.exports = member;