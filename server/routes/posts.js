const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

router.post('/', auth, upload.array('images'), postController.createPost);
router.get('/', auth, postController.getFeed);

module.exports = router;