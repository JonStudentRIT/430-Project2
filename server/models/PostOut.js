const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
const setPost = (postOut) => _.escape(postOut).trim();

const PostOutSchema = new mongoose.Schema({
  // user name who made the post
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  // the post text
  postOut: {
    type: String,
    required: true,
    trim: true,
    set: setPost,
  },
  // identity of the post
  index: {
    type: String,
    required: true,
  },
  // channel that the post can be seen on
  channel:{
    type: String,
    required: true,
    trim: true,
  },
  // mongo id string
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  // the date that the post was created
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// setup for redis
PostOutSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  postOut: doc.postOut,
});

// send to mongo
const PostOutModel = mongoose.model('PostOut', PostOutSchema);
module.exports = PostOutModel;
