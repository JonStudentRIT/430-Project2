const models = require('../models');
const { db } = require('../models/Post');

const { Post } = models;

const makerPage = async (req, res) => res.render('app');

const getPosts = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Post.find(query).select('name age backstory').lean().exec();
    return res.json({ posts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

const makePost = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.backstory) {
    return res.status(400).json({ error: 'Please Fill out all fields' });
  }

  const postData = {
    name: req.body.name,
    age: req.body.age,
    backstory: req.body.backstory,
    index: '',
    owner: req.session.account._id,
  };

  try {
    const newPost = new Post(postData);
    // assign the index to the _id value
    newPost.index = newPost._id;
    await newPost.save();
    return res.status(201).json(
      { name: newPost.name, age: newPost.age, backstory: newPost.backstory },
    );
  } catch (err) {
    return res.status(500).json({ error: 'An error occured making your post!' });
  }
};

const deletePost = async (req, res) => {
  try {
    db.collections.posts.deleteOne({ index: req.body.id });
    return res.status(201).json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting post!' });
  }
};

module.exports = {
  makerPage,
  makePost,
  getPosts,
  deletePost,
};
