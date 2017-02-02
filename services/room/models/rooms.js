const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// replace the mongoose built-in Promise lib due to the warning
mongoose.Promise = require('bluebird');

var RoomSchema = new Schema({
  'title' : { type: String, required: true },
  'desc' : { type: String },
  'removed' : { type: Boolean, default: false},
  'created' : { type: Date, default: Date.now },
  'updated' : { type: Date, default: Date.now }
});

exports.Model = mongoose.model('rooms', RoomSchema);
