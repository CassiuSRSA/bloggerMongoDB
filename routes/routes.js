const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const router = express.Router();

//////////////////// LANDING PAGE GET ////////////////////

router.get("/", async (req, res) => {
  const posts = await db.getDb().collection("posts").find({}).toArray();
  res.render("home", { posts: posts });
});

//////////////////// SIGNUP GET ////////////////////

router.get("/signup", (req, res) => {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      username: "",
      email: "",
      confirmEmail: "",
      password: "",
    };
  }

  req.session.inputData = null;
  res.render("signup", { inputData: sessionInputData });
});

//////////////////// LOGIN GET ////////////////////

router.get("/login", (req, res) => {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      username: "",
      email: "",
      password: "",
    };
  }

  req.session.inputData = null;
  res.render("login", { inputData: sessionInputData });
});

//////////////////// SIGNUP POST ////////////////////

router.post("/signup", async (req, res) => {
  const userData = req.body;
  const enteredUsername = userData.username;
  const enteredEmail = userData.email;
  const enteredConfirmEmail = userData["confirm-email"];
  const enteredPassword = userData.password;

  if (
    !enteredUsername ||
    !enteredEmail ||
    !enteredConfirmEmail ||
    !enteredPassword ||
    enteredPassword.trim() < 6 ||
    enteredEmail !== enteredConfirmEmail ||
    !enteredEmail.includes("@")
  ) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data.",
      username: enteredUsername,
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };

    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  if (existingUser) {
    req.session.inputData = {
      hasError: true,
      message: "User already exists!",
      username: enteredUsername,
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };

    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  const user = {
    username: enteredUsername,
    email: enteredEmail,
    password: hashedPassword,
  };

  await db.getDb().collection("users").insertOne(user);
  res.redirect("/login");
});

//////////////////// LOGIN POST ////////////////////

router.post("/login", async (req, res) => {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  if (!existingUser) {
    req.session.inputData = {
      hasError: true,
      message: "Could not log you in - please check your credentials!",
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  const passwordsAreEqual = await bcrypt.compare(
    enteredPassword,
    existingUser.password
  );

  if (!passwordsAreEqual) {
    req.session.inputData = {
      hasError: true,
      message: "Could not log you in - please check your credentials!",
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  req.session.user = {
    username: existingUser.username,
    id: existingUser._id,
    email: existingUser.email,
  };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect("/profile");
  });
});

//////////////////// ADMIN GET  ////////////////////

router.get("/admin", (req, res) => {
  if (!res.locals.isAuth) {
    // if (!req.session.user)
    return res.status(401).render("401");
  }

  if (!res.locals.isAdmin) {
    return res.status(403).render("403");
  }

  res.render("admin");
});

//////////////////// PROFILE GET ////////////////////

router.get("/profile", async (req, res) => {
  const posts = await db
    .getDb()
    .collection("posts")
    .find({ username: req.session.user.username })
    .toArray();

  if (!res.locals.isAuth) {
    // if (!req.session.user)
    return res.status(401).render("401");
  }

  res.render("profile", { posts: posts });
});

//////////////////// LOGOUT POST ////////////////////

router.post("/logout", (req, res) => {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect("/");
});

router.get("*", (req, res) => {
  res.status(404).render("404");
});

router.post("*", (req, res) => {
  res.status(404).render("404");
});

module.exports = router;
