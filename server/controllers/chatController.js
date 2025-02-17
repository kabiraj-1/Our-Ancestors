const Message = require('../models/Message');

exports.getChatHistory = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user._id }
            ]
        }).sort('createdAt');
        
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};