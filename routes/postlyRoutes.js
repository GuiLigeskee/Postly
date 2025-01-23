const express = require("express");
const router = express.Router();
const PostlyController = require("../controllers/PostlyController");

router.get("/", PostlyController.showAllPosts);

module.exports = router;
