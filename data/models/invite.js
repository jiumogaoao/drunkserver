var mongoose = require('mongoose');
var memberSchema = require('../schemas/invite');
var member = mongoose.model('invite',memberSchema);
module.exports = member;