const express = require("express");
const router = express.Router();

const { getOrderById } = require("../controllers/orders");

router.get("/:id", getOrderById);

module.exports = router;
