// JavaScript Document
var mongoose = require('mongoose');
var memberSchema = require('../schemas/redPacket');
var member = mongoose.model('redPacket',memberSchema);
module.exports = member;