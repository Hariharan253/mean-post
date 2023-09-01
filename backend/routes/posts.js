const express = require("express");

const Post = require("../models/post")

const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const PostController = require("../controllers/posts");

router.post("", checkAuth, PostController.createPost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.put("/:id", checkAuth, PostController.updatePost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
