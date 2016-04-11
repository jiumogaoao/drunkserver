var mongoose = require('mongoose');
var memberSchema = require('../schemas/link');
var member = mongoose.model('client_password',memberSchema);
module.exports = member;