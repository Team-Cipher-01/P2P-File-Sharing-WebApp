const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema(
  {
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    user: { type: String, default: '' },
    socketId: { type: String, required: true },
    active: { type: Boolean, default: false },
    size: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', FileSchema, 'files');
