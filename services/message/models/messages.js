const mongoose = require('mongoose')
	, Schema = mongoose.Schema;

// replace the mongoose built-in Promise lib due to the warning
mongoose.Promise = require('bluebird');

var MessageSchema = new Schema({
  'rid' : { type: Schema.Types.ObjectId, ref: 'rooms' },
  'from' : { type: Schema.Types.ObjectId, ref: 'users' },
  'content' : { type: String },
  'updated' : { type: Date, default: Date.now },
  'created' : { type: Date, default: Date.now }
}, {
  usePushEach: true
});

exports.Model = mongoose.model('messages', MessageSchema);
