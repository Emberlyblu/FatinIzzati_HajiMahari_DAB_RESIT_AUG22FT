var express = require("express");
var router = express.Router();
const passport = require("passport");
const db = require("../../FatinIzzati_HajiMahari_DAB_RESIT_AUG22FT/models");

/* GET home page. */
router.get("/", function (req, res, next) {
  const user = req.user ? req.user : req.user;
  res.render("index", { title: "Express", user: user });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Express", user: req.user, error: null });
});

router.post("/login/password", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login", {
        title: "Express",
        error: "Invalid username or password.",
        user: req.user,
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log("Logout error:", err);
    } else {
      console.log("Session successfully destroyed");
      res.redirect("/");
    }
  });
});

router.get("/signup", function (req, res, next) {
  res.render("signup", { title: "Express", user: req.user });
});

router.post("/signup", function (req, res, next) {
  const { username, firstname, lastname, password } = req.body;
  const insertUserSql = `INSERT INTO Users (username, password, firstName, lastName, roleId) VALUES (?, ?, ?, ?, ?)`;

  db.sequelize
    .query(insertUserSql, {
      replacements: [username, password, firstname, lastname, 2],
    })
    .then(() => res.redirect("/login"))
    .catch((error) => next(error));
});

module.exports = router;
