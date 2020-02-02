const { Product } = require("../models");

/**
 * @swagger
 *
 * /products:
 *   get:
 *     summary: Get all product
 *     tags:
 *       - Products
 *     description: Get all products
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: login
 */
exports.getAllProduct = async (req, res) => {
  try {
    // get all product from database
    const products = await Product.findAll();

    // return 200
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 *
 * /products/{code}:
 *   get:
 *     summary: Get product by code
 *     tags:
 *       - Products
 *     description: get product by code
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         description: code of product that you want to find
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
exports.getProductByCode = async (req, res) => {
  try {
    const { code } = req.params;

    // check if product with the given code exists
    let product = await Product.findOne({
      where: {
        code: code
      }
    });
    if (!product)
      return res.status(404).json({ error: "No product with the given code" });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 *
 * /products:
 *   post:
 *     summary: Create new product
 *     tags:
 *       - Products
 *     description: Create new product
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: product data
 *         in: body
 *         required: true
 *         schema:
 *           properties:
 *             code:
 *               type: string
 *               example: BR001
 *             name:
 *               type: string
 *               example: Headset Razer
 *             price:
 *               type: integer
 *               example: 45000
 *             stock:
 *               type: integer
 *               example: 45
 *     responses:
 *       200:
 *         description: login
 */
exports.createProduct = async (req, res) => {
  try {
    const { code, name, price, stock } = req.body;

    // find or create product
    const product = await Product.findOrCreate({
      where: {
        code: code
      },
      defaults: {
        code,
        name,
        price,
        stock
      }
    });

    // if product code already exists
    if (!product[1])
      return res.status(409).json({ error: "Product code already exists" });

    res.status(200).json({
      success: true,
      data: product[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 *
 * /products/{code}:
 *   put:
 *     summary: Update product by code
 *     tags:
 *       - Products
 *     description: update product by code
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         description: code of product that you want to update
 *         type: string
 *       - name: product data
 *         in: body
 *         required: true
 *         schema:
 *           properties:
 *             name:
 *               type: string
 *               example: Headset Razer
 *             price:
 *               type: integer
 *               example: 45000
 *             stock:
 *               type: integer
 *               example: 45
 *     responses:
 *       200:
 *         description: login
 */
exports.updateProduct = async (req, res) => {
  try {
    const { code } = req.params;
    const { name, price, stock } = req.body;

    // check if product with the given code exists
    let product = await Product.findOne({
      where: {
        code: code
      }
    });
    if (!product)
      return res.status(404).json({ error: "No product with the given code" });

    // update product and save
    product.name = name;
    product.price = price;
    product.stock = stock;
    product = await product.save();

    // return 200 with updated product
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 *
 * /products/{code}:
 *   delete:
 *     summary: Delete product by code
 *     tags:
 *       - Products
 *     description: update product by code
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         description: code of product that you want to delete
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { code } = req.params;

    // check if product with the given code exists
    let product = await Product.findOne({
      where: {
        code: code
      }
    });

    // if product with the given code not found
    if (!product)
      return res.status(404).json({ error: "No product with the given code" });

    // delete product
    await product.destroy();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
