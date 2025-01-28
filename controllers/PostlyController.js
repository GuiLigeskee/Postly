const Post = require("../models/Post");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class PostlyController {
  static async showAllPosts(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let order = "DESC";

    if (req.query.order === "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    const postlysData = await Post.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [["createdAt", order]],
    });

    const postlys = postlysData.map((result) => result.get({ plain: true }));

    let postlysQty = postlys.length;

    if (postlysQty === 0) {
      postlysQty = false;
    }

    res.render("postly/home", { postlys, search, postlysQty });
  }

  static async dashboard(req, res) {
    const userId = req.session.userId;

    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Post,
      plain: true,
    });

    // check if user exists
    if (!user) {
      res.redirect("/login");
    }

    const postlys = user.Posts.map((result) => result.dataValues);

    let emptyPostlys = false;

    if (postlys.length === 0) {
      emptyPostlys = true;
    }

    res.render("postly/dashboard", { postlys });
  }

  static createPostly(req, res) {
    res.render("postly/create");
  }

  static async createPostlySave(req, res) {
    const postly = {
      title: req.body.title,
      description: req.body.description,
      UserId: req.session.userId,
    };

    try {
      await Post.create(postly);

      req.flash("message", "Postly criado com sucesso!");

      req.session.save(() => {
        res.redirect("/postly/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async removePostly(req, res) {
    const id = req.body.id;
    const UserId = req.session.userId;

    try {
      await Post.destroy({ where: { id: id, UserId: UserId } });
      req.flash("message", "Postly removido com sucesso!");

      req.session.save(() => {
        res.redirect("/postly/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async updatePostly(req, res) {
    const id = req.params.id;

    const postly = await Post.findOne({ where: { id: id }, raw: true });

    res.render("postly/edit", { postly });
  }

  static async updatePostlySave(req, res) {
    const id = req.body.id;

    const postly = {
      title: req.body.title,
      description: req.body.description,
    };

    try {
      await Post.update(postly, { where: { id: id } });

      req.flash("message", "Postly atualizado com sucesso!");

      req.session.save(() => {
        res.redirect("/postly/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }
};
