const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const { User } = require("../models");

/**
 * POST api/users/login
 * @desc user login
 */
router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 4 })],
  async (req, res) => {
    try {
      // check validation errors, if any return 422
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ success: false, error: errors.array() });

      // get data from request body
      const { email, password } = req.body;

      // find user by email
      const user = await User.findOne({ where: { email: email } });

      // if user not found return 404
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "Email didn't exists" });

      // if password doesn't match return with 401 unauthorize
      if (!bcrypt.compareSync(password, user.password))
        return res
          .status(401)
          .json({ success: false, message: "Wrong password" });

      // generate access token
      const token = jwt.sign({ email: user.email }, "secret");

      // return with 200 status code with token
      res.status(200).json({ message: "success", accessToken: token });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * POST api/users/register
 * @desc registering user
 */
router.post(
  "/register",
  [
    check("email").isEmail(),
    check("name").isLength({ min: 3 }),
    check("password").isLength({ min: 4 })
  ],
  async (req, res) => {
    try {
      // check validation errors, if any return 422
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ success: false, error: errors.array() });

      // get data
      const { email, name, password } = req.body;

      // check if email already exists
      const findUser = await User.findOne({ email: email });
      if (findUser)
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });

      // generate salt and hash for password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      // create user
      const user = await User.create({
        email,
        name,
        password: hash
      });

      // generate access token
      const token = jwt.sign({ email: user.email }, "secret");

      // return 200 successful
      res.status(200).json({
        success: true,
        data: { name: user.name, email: user.email, accessToken: token }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

module.exports = router;
