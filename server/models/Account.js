// encrypt the account information
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;

let AccountModel = {};

const AccountSchema = new mongoose.Schema({
  // user of the account
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  // password of the account
  password: {
    type: String,
    required: true,
  },
  // date the account was created
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// setup for redus
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

// make the hash for the password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

// check if the password is the correct one for the user
AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

// send to mongo
AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
