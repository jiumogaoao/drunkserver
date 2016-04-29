var mongoose = require('mongoose');
var memberSchema = require('../schemas/album');
var member = mongoose.model('album',memberSchema);
module.exports = member;