const express = require("express");
const router = express.Router();
const {
  validate,
  userLoginValidationRules,
  userRegisterValidationRules
} = require("../middlewares/validator");
const { userLogin, userRegister } = require("../controllers/users");

/**
 * POST api/v1/users/login
 * @desc user login
 */
router.post("/login", userLoginValidationRules(), validate, userLogin);

/**
 * POST api/users/register
 * @desc registering user
 */
router.post("/register", userRegisterValidationRules(), validate, userRegister);

module.exports = router;
