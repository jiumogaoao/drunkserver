var mongoose = require('mongoose');
var memberSchema = require('../schemas/zone');
var member = mongoose.model('zone',memberSchema);
module.exports = member;