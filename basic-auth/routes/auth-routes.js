const express = require('express');
const User = require("../models/user-models.js");
const authRoutes = express.Router();
const bcrypt = require('bcrypt');

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username },
    "_id username password following",
    (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup-view.ejs');
  });

  authRoutes.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

if (username === '' || password === '') {
  res.render('auth/signup-view.ejs', {
    errorMessage: 'Please fill out both username and password foo\'!'
  });
}

  User.findOne(
    { username: username },
    { username: 1},

    (err, foundUser)=> {
    if (err) {
      next(err);
      return;
    }

    if (foundUser !== null) {
      res.render('auth/signup-view.ejs', {
        errorMessage: 'The username already exists'
      });
      return;
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const userInfo  = {
      username: username,
      password: hashPass
    };

    const theUser = new User(userInfo);

    theUser.save((err) => {
      if (err) {
        res.render('auth/signup-view.ejs', {
          errorMessage: 'Oops! There was a problem. Try again later.'
        });
        return;
      }
      res.redirect("/");
    });
  });
});
module.exports = authRoutes;
