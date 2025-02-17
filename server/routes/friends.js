const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const auth = require('../middleware/auth');

router.post('/:userId/request', auth, friendController.sendRequest);

module.exports = router;