var mongoose = require('mongoose');
var memberSchema = require('../schemas/group');
var member = mongoose.model('group',memberSchema);
module.exports = member;