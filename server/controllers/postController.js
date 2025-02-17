const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    try {
        const post = new Post({
            user: req.user._id,
            content: req.body.content,
            images: req.files.map(file => `/assets/uploads/${file.filename}`)
        });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getFeed = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username profilePicture')
            .sort('-createdAt');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};