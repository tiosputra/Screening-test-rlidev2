const express = require("express");
const passport = require("passport");
const productOrderController = require("../controllers/product_order");
const {
  validate,
  productOrderGetValidationRules,
  productOrderCreateValidationRules,
  productOrderUpdateValidationRules,
  productOrderDeleteValidationRules
} = require("../middlewares/validator");

const router = express.Router();

/**
 * GET /api/v1/orders/:orderId/product/:productOrderId
 * @desc get product order
 */
router.get(
  "/:orderId/products/:productOrderId",
  passport.authenticate("jwt"),
  productOrderGetValidationRules(),
  validate,
  productOrderController.getProductOrder
);

/**
 * POST /api/v1/orders/:orderId/product/
 * @desc create product order
 */
router.post(
  "/:orderId/products/",
  passport.authenticate("jwt"),
  productOrderCreateValidationRules(),
  validate,
  productOrderController.createProductOrder
);

/**
 * PUT /api/v1/orders/:orderId/product/:productOrderId
 * @desc update product order
 */
router.put(
  "/:orderId/products/:productOrderId",
  passport.authenticate("jwt"),
  productOrderUpdateValidationRules(),
  validate,
  productOrderController.updateProductOrder
);

/**
 * Delete /api/v1/orders/:orderId/product/:productOrderId
 * @desc delete product order
 */
router.delete(
  "/:orderId/products/:productOrderId",
  passport.authenticate("jwt"),
  productOrderDeleteValidationRules(),
  validate,
  productOrderController.deleteProductOrder
);

module.exports = router;
