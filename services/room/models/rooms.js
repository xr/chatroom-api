const mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var RoomSchema = new Schema({
  'title' : { type: String, required: true },
  'desc' : { type: String },
  'removed' : { type: Boolean, default: false},
  'created' : { type: Date, default: Date.now },
  'updated' : { type: Date, default: Date.now }
});

exports.Model = mongoose.model('rooms', RoomSchema);
