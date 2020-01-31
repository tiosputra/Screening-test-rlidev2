const express = require("express");
const { check, param, validationResult } = require("express-validator");
const router = express.Router();
const { Product } = require("../models");

/**
 * GET /api/products
 * get all products
 */
router.get("/", async (req, res) => {
  try {
    // get all product from database
    const products = await Product.findAll();

    // return 200
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/products
 * create new product
 */
router.post(
  "/",
  [
    check("code")
      .isLength({ min: 5 })
      .isString(),
    check("name").isString(),
    check("price")
      .isNumeric()
      .isLength({ min: 4 }),
    check("stock").isNumeric()
  ],
  async (req, res) => {
    try {
      // check validation errors, if any return 422
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ error: errors.array() });

      const { code, name, price, stock } = req.body;

      // find or create product
      const product = await Product.findOrCreate({
        where: { code: code },
        defaults: {
          code,
          name,
          price,
          stock
        }
      });

      // if product code already exists
      if (!product[1])
        return res.status(409).json({
          success: false,
          error: "Product code already exists"
        });

      res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * PUT /api/products/:id
 * update product by code
 */
router.put(
  "/:code",
  [
    check("code")
      .isLength({ min: 5 })
      .isString(),
    check("name").isString(),
    check("price")
      .isNumeric()
      .isLength({ min: 4 }),
    check("stock").isNumeric(),
    param("code").exists()
  ],
  async (req, res) => {
    try {
      // check validation errors, if any return 422
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ error: errors.array() });

      const { code } = req.params;
      const { name, price, stock } = req.body;

      // check if product with the given code exists
      let product = await Product.findOne({ where: { code: code } });
      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "No product with the given code" });

      // update product and save
      product.name = name;
      product.price = price;
      product.stock = stock;
      product = await product.save();

      // return 200 with updated product
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * DELETE
 * delete product by code
 */
router.delete("/:code", [param("code").exists()], async (req, res) => {
  try {
    // check validation errors, if any return 422
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array() });

    const { code } = req.params;

    // check if product with the given code exists
    let product = await Product.findOne({ where: { code: code } });

    // if product with the given code not found
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "No product with the given code" });

    // delete product
    await product.destroy();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
