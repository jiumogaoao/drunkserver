var mongoose = require('mongoose');
var memberSchema = require('../schemas/anyArray');
var member = mongoose.model('obj',memberSchema);
module.exports = member;