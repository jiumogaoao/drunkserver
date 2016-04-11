var mongoose = require('mongoose');
var memberSchema = require('../schemas/any');
var member = mongoose.model('config',memberSchema);
module.exports = member;