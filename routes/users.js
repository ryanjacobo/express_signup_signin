var express = require('express');
var router = express.Router();
var models = require('../models');

var authService = require('../services/auth');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// Signup
router.post("/signup", function (req, res, next) {
  const { firstname, lastname, email, username, password } = req.body;

  if (!firstname || !lastname || !email || !username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  models.User
    .findOrCreate({
      where: { username: req.body.username },
      defaults: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: authService.hashPassword(req.body.password)
      },
    })
    .spread(function (result, created) {
      if (created) {
        res.send("User created successfully.");
      } else {
        res.status(400);
        res.send("That username already exist.");
      }
    });
});

// Login
router.post("/login", function (req, res, next) {
  models.User
    .findOne({
      where: {
        username: req.body.username,
      },
    })
    .then((user) => {
      if (!user) {
        console.log("User not found");
        return res.status(401).json({
          message: "User not found",
        });
      } else {
        let passwordMatch = authService.comparePasswords(
          req.body.password,
          user.password
        );
        if (passwordMatch) {
          let token = authService.signUser(user);
          res.cookie("jwt", token);
          res.send("Login successful");
          //This doesn't need to be here at the moment but can be used for admin 3001 purposes in the future
          //res.redirect('addTransaction');
        } else {
          console.log("Wrong Password");
          res.status(400);
          res.send("Wrong Password");
          //res.redirect('login');
        }
      }
    });
});

// GET user info
router.get("/", function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then((user) => {
      if (user) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(user));
      } else {
        res.status(401);
        res.send("Invalid authentication token");
      }
    });
  } else {
    res.status(401);
    res.send("Must be logged in");
    // console.log('Must be logged in');
    // res.redirect('login')
  }
});

// logout
router.get("/logout", function (req, res, next) {
  res.cookie("jwt", "", { expire: new Date(0) });
  res.send("Logged out");
  console.log("Logged out");
  res.redirect("login");
});

module.exports = router;
