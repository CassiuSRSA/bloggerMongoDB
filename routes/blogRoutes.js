const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/posts/new", (req, res) => {
  if (!res.locals.isAuth) {
    return res.redirect("/login");
  }
  res.render("create-post");
});

router.post("/posts/new", async (req, res) => {
  const post = {
    username: req.session.user.username,
    userId: req.session.user.id,
    title: req.body.title,
    text: req.body.post,
    date: new Date(),
  };
  await db.getDb().collection("posts").insertOne(post);
  res.redirect("/profile");
});

router.get("/posts/:id", async (req, res, next) => {
  let postId = req.params.id;

  try {
    postId = new ObjectId(postId);
  } catch (error) {
    return res.status(404).render("404");
  }

  const post = await db.getDb().collection("posts").findOne({ _id: postId });

  if (!post) {
    return res.status(404).render("404");
  }

  post.humanReadableDate = post.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  post.date = post.date.toISOString();

  res.render("post-detail", { post: post });
});

router.get("/posts/:id/edit", async (req, res) => {
  const postId = req.params.id;
  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: new ObjectId(postId) });

  if (!post) {
    return res.status(404).render("404");
  }
  res.render("update-post", { post: post });
});

router.post("/posts/:id/edit", async (req, res) => {
  const postId = new ObjectId(req.params.id);
  const result = await db
    .getDb()
    .collection("posts")
    .updateOne(
      { _id: postId },
      {
        $set: {
          title: req.body.title,
          text: req.body.post,
        },
      }
    );

  res.redirect("/profile");
});

router.post("/posts/:id/delete", async (req, res) => {
  const postId = new ObjectId(req.params.id);
  const result = await db
    .getDb()
    .collection("posts")
    .deleteOne({ _id: postId });
  res.redirect("/profile");
});

module.exports = router;
