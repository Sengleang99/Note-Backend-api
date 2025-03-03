const moogoose = require('mongoose');
const Schema = moogoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: new Date().getTime()
  }
});

module.exports = moogoose.model('users', userSchema);