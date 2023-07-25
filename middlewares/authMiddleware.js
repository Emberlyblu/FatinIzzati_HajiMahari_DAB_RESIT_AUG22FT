const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const db = require("../models");

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    function (username, password, done) {
      db.User.findOne({ where: { username: username } })
        .then(function (user) {
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }
          if (password !== user.password) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        })
        .catch(done);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  db.User.findByPk(id)
    .then(function (user) {
      done(null, user);
    })
    .catch(done);
});

function isCustomer(req, res, next) {
  if (req.isAuthenticated() && req.user.roleId === 2) return next();
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.roleId === 1) return next();
  res.redirect("/login");
}

module.exports = {
  passport: passport,
  isCustomer: isCustomer,
  isAdmin: isAdmin,
};
