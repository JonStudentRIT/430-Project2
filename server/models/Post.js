const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
const setBackstory = (backstory) => _.escape(backstory).trim();

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  // added atribute for expansion
  backstory: {
    type: String,
    required: true,
    trim: true,
    set: setBackstory,
  },
  // extra added atribute for managing the delete function
  index: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  backstory: doc.backstory,
});

const PostModel = mongoose.model('Post', PostSchema);
module.exports = PostModel;
