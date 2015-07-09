var mongoose = require('mongoose');
var memberSchema = require('../schemas/demo');
var member = mongoose.model('demo',memberSchema);
module.exports = member;