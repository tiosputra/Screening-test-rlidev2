const { Product } = require("../models");

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
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

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
      return res.status(404).json({
        success: false,
        message: "No product with the given code"
      });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

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
      return res.status(409).json({
        success: false,
        error: "Product code already exists"
      });

    res.status(200).json({
      success: true,
      data: product[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

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
      return res.status(404).json({
        success: false,
        message: "No product with the given code"
      });

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
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

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
      return res.status(404).json({
        success: false,
        message: "No product with the given code"
      });

    // delete product
    await product.destroy();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
