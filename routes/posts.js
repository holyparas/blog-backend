const express = require("express");
const router = express.Router();
const postsController = require("../controller/postsController");
const authenticateJWT = require("../middleware/authenticateJWT");

// GET /api/posts -> return all posts
router.get("/", postsController.getPosts);

router.get("/:id", postsController.getPostsById);

router.get("/:id/comments", postsController.getComments);

router.post("/", authenticateJWT, postsController.createPost);

router.post("/:id/comments", postsController.createComment);

module.exports = router;
