var mongoose = require('mongoose');
var memberSchema = require('../schemas/express');
var member = mongoose.model('express',memberSchema);
module.exports = member;