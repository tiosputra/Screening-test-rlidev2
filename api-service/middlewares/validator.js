const { check, param, validationResult } = require("express-validator");

/**
 * Validation middleware
 */
exports.validate = (req, res, next) => {
  // check validation errors, if any return 422
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ success: false, error: errors.array() });

  // if error not found go to next function
  next();
};

// Users API Validation Rules
/**
 * user login rules
 */
exports.userLoginValidationRules = () => {
  return [check("email").isEmail(), check("password").isLength({ min: 4 })];
};

/**
 * user register rules
 */
exports.userRegisterValidationRules = () => {
  return [
    check("email").isEmail(),
    check("name").isLength({ min: 3 }),
    check("password").isLength({ min: 4 })
  ];
};

// Products API Validation Rules
/**
 * create product rules
 */
exports.productCreateValidationRules = () => {
  return [
    check("code")
      .isLength({
        min: 5
      })
      .isString(),
    check("name").isString(),
    check("price")
      .isNumeric()
      .isLength({
        min: 4
      }),
    check("stock").isNumeric()
  ];
};

/**
 * update product rules
 */
exports.productUpdateValidationRules = () => {
  return [
    check("name").isString(),
    check("price")
      .isNumeric()
      .isLength({
        min: 4
      }),
    check("stock").isNumeric(),
    param("code").exists()
  ];
};
