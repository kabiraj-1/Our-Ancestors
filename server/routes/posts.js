const express = require("express");
const { createPost, getPosts } = require("../controllers/postController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createPost);
router.get("/", getPosts);

module.exports = router;
