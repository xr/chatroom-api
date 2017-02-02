const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const UserSchema = new Schema({
  'username' : { type: String, required: true, index: true, unique: true },
  'password' : { type: String },
  'avatar' : { type: String },
  'name' : { type: String },
  'sign' : { type: String },
  'blocked' : {type: Boolean, default: false },
  'created' : { type: Date, default: Date.now },
  'updated' : { type: Date, default: Date.now }
});

// schama updatable fields
UserSchema.methods.publicUpdate = function(user, fields) {
  const updatableFields = [
    'password',
    'avatar',
    'name',
    'sign',
    'updated'
  ];
  for (const field in fields) {
    if (updatableFields.indexOf(field) !== -1) {
      user[field] = fields[field];
    }
  }
  return user;
}
exports.Model = mongoose.model('users', UserSchema);
