const express = require("express");
const router = express.Router();
const {
  validate,
  userLoginValidationRules,
  userRegisterValidationRules
} = require("../middlewares/validator");
const userController = require("../controllers/users");

/**
 * POST api/v1/users/login
 * @desc user login
 */
router.post(
  "/login",
  userLoginValidationRules(),
  validate,
  userController.userLogin
);

/**
 * POST api/users/register
 * @desc registering user
 */
router.post(
  "/register",
  userRegisterValidationRules(),
  validate,
  userController.userRegister
);

router.get("/example", userController.userExample);

module.exports = router;
