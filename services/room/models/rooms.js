const mongoose = require('mongoose')
	, config = require('../../../config')
	, Schema = mongoose.Schema;

// replace the mongoose built-in Promise lib due to the warning
mongoose.Promise = require('bluebird');

var RoomSchema = new Schema({
  'title' : { type: String, unique: true, required: true },
  'desc' : { type: String },
  'logo' : { type: String },
  'owner' : { type: Schema.Types.ObjectId, ref: 'users' },
  'users': [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
  'removed' : { type: Boolean, default: false},
  'private' : { type: Boolean, default: false},
  'created' : { type: Date, default: Date.now },
  'updated' : { type: Date, default: Date.now }
});

RoomSchema.virtual('_links').get(function () {
	return {
		'self': {
			href: `api/v1/rooms/${this._id}`
		}
	};
})

exports.Model = mongoose.model('rooms', RoomSchema);
