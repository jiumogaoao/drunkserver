var mongoose = require('mongoose');
var memberSchema = require('../schemas/com');
var member = mongoose.model('com',memberSchema);
module.exports = member;