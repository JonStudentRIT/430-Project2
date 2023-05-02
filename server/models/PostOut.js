const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
const setPost = (postOut) => _.escape(postOut).trim();

const PostOutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  postOut: {
    type: String,
    required: true,
    trim: true,
    set: setPost,
  },
  index: {
    type: String,
    required: true,
  },
  channel:{
    type: String,
    required: true,
    trim: true,
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

PostOutSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  postOut: doc.postOut,
});

const PostOutModel = mongoose.model('PostOut', PostOutSchema);
module.exports = PostOutModel;
