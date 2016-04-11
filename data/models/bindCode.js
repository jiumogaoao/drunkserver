var mongoose = require('mongoose');
var memberSchema = require('../schemas/bindCode');
var member = mongoose.model('bindCode',memberSchema);
module.exports = member;