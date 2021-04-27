const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// replace the mongoose built-in Promise lib due to the warning
mongoose.Promise = require('bluebird');

const UserSchema = new Schema({
  'name' : { type: String },
  'fbid' : { type: String, unique: true, required: true },
  'sign' : { type: String },
  'avatar': { type: String },
  'rooms' : [{
    type: Schema.Types.ObjectId,
    ref: 'rooms'
  }],
  'blocked' : {type: Boolean, default: false },
  'online' : {type: Number, default: 0 },
  'created' : { type: Date, default: Date.now },
  'updated' : { type: Date, default: Date.now }
});

// schama updatable fields
UserSchema.methods.publicUpdate = function(user, fields) {
  const updatableFields = [
    'name',
    'sign',
    'updated',
    'rooms'
  ];
  for (const field in fields) {
    if (updatableFields.indexOf(field) !== -1) {
      user[field] = fields[field];
    }
  }
  return user;
}
exports.Model = mongoose.model('users', UserSchema);
