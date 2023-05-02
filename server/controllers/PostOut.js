const models = require('../models');
const { db } = require('../models/PostOut');

const { PostOut } = models;

const makerPage = async (req, res) => res.render('app');

const getPosts = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await PostOut.find(query).select('name postOut').lean().exec();
    return res.json({ posts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

const makePost = async (req, res) => {
  if (!req.body.name || !req.body.channel || !req.body.postOut) {
    return res.status(400).json({ error: 'Please Fill out all fields' });
  }

  const postOutData = {
    name: req.body.name,
    postOut: req.body.postOut,
    channel: req.body.channel,
    index: '',
    owner: req.session.account._id,
  };

  try {
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

// const deletePost = async (req, res) => {
//   try {
//     console.log(req);
//     db.collections.postOuts.deleteOne({ index: req.body._id });
//     return res.status(201).json({});
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'Error deleting post!' });
//   }
// };

module.exports = {
  makerPage,
  makePost,
  getPosts,
  // deletePost,
};
