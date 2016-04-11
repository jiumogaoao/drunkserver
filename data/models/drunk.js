var mongoose = require('mongoose');
var memberSchema = require('../schemas/drunk');
var member = mongoose.model('drunk',memberSchema);
module.exports = member;