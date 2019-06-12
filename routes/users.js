var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../Models/userModel");

function secondsCounter(user) {
  var currentTime = new Date();
  let timeDiff = currentTime - user.creation_dt;
  timeDiff /= 1000;
  let seconds = Math.round(Math.abs(timeDiff));

  return seconds;
}

router.post("/register", (req, res, next) => {
  addToDB(req, res);
});

async function addToDB(req, res) {
  var user = new User({
    email: req.body.email,
    username: req.body.username,
    password: User.hashPassword(req.body.password),
    creation_dt: Date.now()
  });

  try {
    doc = await user.save();
    return res.status(201).json(doc);
  } catch (error) {
    return res.status(501).json(error);
  }
}

router.post("/login", (req, res, next) => {
  passport.authenticate("local", function(err, user, info) {
    var seconds = secondsCounter(user);
    if (err) {
      return res.status(501).json(err);
    }
    if (!user) {
      return res.status(501).json(info);
    }

    req.logIn(user, function(err) {
      console.log(seconds);

      if (err) {
        return res.status(501).json(err);
      }

      if (seconds < 120) {
        return res.status(401).json("Unauthorized request");
      } else {
        console.log("Hi");
        return res.status(201).json({
          message: "Login Success",
          Date: user.creation_dt.getMinutes(),
          seconds: seconds
        });
      }

      // setInterval(() => {
      //   if (seconds < 120) {
      //     console.log(seconds);
      //     return res.status(401).json("Unauthorized request");
      //   } else {
      //     return res.status(201).json({
      //       message: "Login Success",
      //       Date: user.creation_dt.getMinutes(),
      //       seconds: seconds
      //     });
      //   }
      // }, 500);
    });
  })(req, res, next);
});

router.get("/appartments", isValidUser, (req, res, next) => {
  return res.status(200).json(req.user);
});

function isValidUser(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).json("Unauthorized request");
  }
}

router.get("/logout", isValidUser, (req, res, next) => {
  req.logOut();
  return res.status(201).json({ message: "Logout Success" });
});

module.exports = router;
