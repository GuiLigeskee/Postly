const express = require("express");
const router = express.Router();
const PostlyController = require("../controllers/PostlyController");

// helpers
const checkAuth = require("../helpers/auth").checkAuth;

router.get("/add", checkAuth, PostlyController.createPostly);
router.post("/add", checkAuth, PostlyController.createPostlySave);
router.get("/edit/:id", checkAuth, PostlyController.updatePostly);
router.post("/edit", checkAuth, PostlyController.updatePostlySave);
router.get("/dashboard", checkAuth, PostlyController.dashboard);
router.post("/remove", checkAuth, PostlyController.removePostly);
router.get("/", PostlyController.showAllPosts);

module.exports = router;
