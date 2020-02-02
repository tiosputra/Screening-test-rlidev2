const express = require("express");
const passport = require("passport");
const orderController = require("../controllers/orders");
const {
  validate,
  orderGetByIdValidationRules,
  orderDeleteValidationRules
} = require("../middlewares/validator");

const router = express.Router();

/**
 * GET /api/v1/orders
 * @desc get all orders
 */
router.get("/", passport.authenticate("jwt"), orderController.getAllOrders);

/**
 * GET /api/v1/orders/:id
 * @desc get order data by id
 */
router.get(
  "/:id",
  passport.authenticate("jwt"),
  orderGetByIdValidationRules(),
  validate,
  orderController.getOrderById
);

/**
 * POST /api/v1/orders
 * @desc create order data, note that we will use userId in jwt for filling the
 * user id foreign key
 */
router.post("/", passport.authenticate("jwt"), orderController.createOrder);

/**
 * Delete /api/v1/orders/:id
 * @desc delete orders by id. if this order has order_product, those will also deleted
 */
router.delete(
  "/:id",
  passport.authenticate("jwt"),
  orderDeleteValidationRules(),
  validate,
  orderController.deleteOrder
);

module.exports = router;
