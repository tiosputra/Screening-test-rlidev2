const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  validate,
  productCreateValidationRules,
  productUpdateValidationRules
} = require("../middlewares/validator");
const productController = require("../controllers/products");

/**
 * GET /api/v1/products
 * @desc get all products
 */
router.get("/", passport.authenticate("jwt"), productController.getAllProduct);

/**
 * GET /api/v1/products/:code
 * @desc get single product with code
 */
router.get(
  "/:code",
  passport.authenticate("jwt"),
  productController.getProductByCode
);

/**
 * POST /api/v1/products
 * @desc create new product
 */
router.post(
  "/",
  passport.authenticate("jwt"),
  productCreateValidationRules(),
  validate,
  productController.createProduct
);

/**
 * PUT /api/v1/products/:code
 * @desc update product by code
 */
router.put(
  "/:code",
  passport.authenticate("jwt"),
  productUpdateValidationRules(),
  validate,
  productController.updateProduct
);

/**
 * DELETE /api/v1/products/:code
 * @desc delete product by code
 */
router.delete(
  "/:code",
  passport.authenticate("jwt"),
  productController.deleteProduct
);

module.exports = router;
