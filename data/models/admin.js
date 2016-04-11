var mongoose = require('mongoose');
var memberSchema = require('../schemas/admin');
var member = mongoose.model('admin',memberSchema);
module.exports = member;