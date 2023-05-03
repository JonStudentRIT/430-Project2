// get the post model
const models = require('../models');
const { db } = require('../models/PostOut');

console.log(db);
const { PostOut } = models;

const makerPage = async (req, res) => res.render('app');

// retrieve all postsand availability will be divided up into channels
// public: available to eveyone
// private: only the user
// friends: everyone who can access the friends channel
const getPosts = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await PostOut.find(query).select('name channel postOut').lean().exec();
    return res.json({ posts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

// assemble the post to send to mongo
const makePost = async (req, res) => {
  if (!req.body.name || !req.body.channel || !req.body.postOut) {
    return res.status(400).json({ error: 'Please Fill out all fields' });
  }

  const postOutData = {
    // current user creating the post : this is pulled from the accout name
    name: req.body.name,
    // content of the post :  this is the text box contents
    postOut: req.body.postOut,
    // the channel the post will be available on : this is pulled from the client channel selected
    channel: req.body.channel,
    // the id of the post in mongo
    index: '',
    // the id of the user in mongo
    owner: req.session.account._id,
  };

  try {
    // create the post
    const newPostOut = new PostOut(postOutData);
    // assign the index to the _id value
    newPostOut.index = newPostOut._id;
    await newPostOut.save();
    return res.status(201).json(
      { name: newPostOut.name, postOut: newPostOut.postOut },
    );
  } catch (err) {
    return res.status(500).json({ error: 'An error occured making your post!' });
  }
};

module.exports = {
  makerPage,
  makePost,
  getPosts,
};
