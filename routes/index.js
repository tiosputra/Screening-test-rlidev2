const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

router.get("/protected", passport.authenticate("jwt"), (req, res) => {
  res.send("protected");
});

module.exports = router;
