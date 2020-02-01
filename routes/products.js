const express = require("express");
const router = express.Router();
const {
  validate,
  productCreateValidationRules,
  productUpdateValidationRules
} = require("../middlewares/validator");
const {
  getAllProduct,
  createProduct,
  getProductByCode,
  updateProduct,
  deleteProduct
} = require("../controllers/products");

/**
 * GET /api/v1/products
 * @desc get all products
 */
router.get("/", getAllProduct);

/**
 * GET /api/v1/products/:code
 * @desc get single product with code
 */
router.get("/:code", getProductByCode);

/**
 * POST /api/v1/products
 * @desc create new product
 */
router.post("/", productCreateValidationRules(), validate, createProduct);

/**
 * PUT /api/v1/products/:code
 * @desc update product by code
 */
router.put("/:code", productUpdateValidationRules(), validate, updateProduct);

/**
 * DELETE /api/v1/products/:code
 * @desc delete product by code
 */
router.delete("/:code", deleteProduct);

module.exports = router;
