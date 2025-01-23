const Post = require("../models/Post");
const User = require("../models/User");

module.exports = class PostlyController {
  static async showAllPosts(req, res) {
    res.render("postly/home");
  }
};
