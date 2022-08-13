const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userId: { type: String, default: '' },
    password: { type: String, default: '' },
    active: { type: Boolean, default: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema, 'users');
