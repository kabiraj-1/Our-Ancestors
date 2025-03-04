const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const newPost = await Post.create({ user: req.user.id, content, image });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profilePic");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
