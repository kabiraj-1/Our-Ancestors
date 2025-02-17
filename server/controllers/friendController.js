const FriendRequest = require('../models/FriendRequest');

exports.sendRequest = async (req, res) => {
    try {
        const request = new FriendRequest({
            sender: req.user._id,
            receiver: req.params.userId
        });
        await request.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};