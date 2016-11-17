var mongoose = require('mongoose');
var memberSchema = require('../schemas/good');
var member = mongoose.model('good',memberSchema);
module.exports = member;