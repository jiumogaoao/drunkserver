var mongoose = require('mongoose');
var memberSchema = require('../schemas/bind');
var member = mongoose.model('bind',memberSchema);
module.exports = member;