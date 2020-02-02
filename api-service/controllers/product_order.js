const { ProductOrder, Order, Product } = require("../models");

/**
 * check if jwt token has access to order product by
 * checking in order resource
 */
async function checkOrderUserAccess(orderId, userId) {
  // check if order id valid
  const order = await Order.findOne({ where: { id: orderId } });
  if (!order) return [404, "order with id not found"];

  // check if user token has access to this
  if (order.userId !== userId)
    return [401, "token have no access to this resource"];

  return [200, "OK"];
}

/**
 * @swagger
 * /orders/{orderId}/products/{productOrderId}:
 *   get:
 *     summary: "get individual product_order"
 *     tags:
 *       - ProductOrder
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         type: integer
 *         description: id for order resource
 *       - name: productOrderId
 *         in: path
 *         required: true
 *         type: integer
 *         description: id for product_order resource
 *     responses:
 *       200:
 *         description: OK
 */
exports.getProductOrder = async (req, res) => {
  try {
    const { orderId, productOrderId } = req.params;

    // check if user has access to this resource
    const access = await checkOrderUserAccess(orderId, req.user.id);
    if (!access[0] === 200)
      return res.status(access[0]).json({ error: access[1] });

    // get product order by orderId and productId
    const productOrder = await ProductOrder.findOne({
      where: {
        id: productOrderId,
        orderId: orderId
      }
    });

    // if product order not found
    if (!productOrder)
      return res.status(404).json({
        error: "product_order not found with the given productOrderId"
      });

    // if success return 200
    res.status(200).json({ success: true, data: productOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /orders/{orderId}/products:
 *   post:
 *     summary: create product_order
 *     tags:
 *       - ProductOrder
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         type: integer
 *         description: id for order resource
 *       - name: new product order data
 *         in: body
 *         required: true
 *         type: integer
 *         schema:
 *           properties:
 *             productId:
 *               type: integer
 *               example: 2
 *             quantity:
 *               type: integer
 *               example: 4
 *     responses:
 *       200:
 *         description: OK
 */
exports.createProductOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { productId, quantity } = req.body;

    // check  user has access to this resource
    const access = await checkOrderUserAccess(orderId, req.user.id);
    if (access[0] !== 200)
      return res.status(access[0]).json({ error: access[1] });

    // check if product with given productId exists
    const product = await Product.findOne({ where: { id: productId } });
    if (!product)
      return res
        .status(404)
        .json({ error: "Product wth productId not founds" });

    // check if product alredy in this product order, if exists return 409 conflict else return 200
    const productOrder = await ProductOrder.findOrCreate({
      where: { orderId: orderId, productId: productId },
      default: {
        orderId: orderId,
        productId: productId,
        quantity: quantity
      }
    });

    // if it exists return 409
    if (!productOrder[1])
      return res.status(409).json({
        error:
          "this product alredy in this order, if you want change the quantity use update product order endpoint instead",
        existingData: productOrder[0]
      });

    // if the resource created
    res.status(200).json({ success: true, data: productOrder[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /orders/{orderId}/products/{productOrderId}:
 *   put:
 *     summary: update product_order
 *     tags:
 *       - ProductOrder
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         type: integer
 *         description: id for order resource
 *       - name: productOrderId
 *         in: path
 *         required: true
 *         type: integer
 *         description: id for product_order resource
 *       - name: product order data for update
 *         in: body
 *         required: true
 *         type: integer
 *         schema:
 *           properties:
 *             quantity:
 *               type: integer
 *               example: 10
 *     responses:
 *       200:
 *         description: OK
 */
exports.updateProductOrder = async (req, res) => {
  try {
    const { orderId, productOrderId } = req.params;
    const { quantity } = req.body;

    // check if user has access to this resource
    const access = await checkOrderUserAccess(orderId, req.user.id);
    if (!access[0] === 200)
      return res.status(access[0]).json({ error: access[1] });

    // check product order with id.
    let productOrder = await ProductOrder.findOne({
      where: { id: productOrderId, orderId: orderId }
    });
    if (!productOrder)
      return res
        .status(404)
        .json({ error: "product order with id doesn't exists" });

    // update the data
    productOrder.quantity = quantity;
    productOrder = await productOrder.save();

    // return 200 with updated product order
    res.status(200).json({
      success: true,
      data: productOrder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /orders/{orderId}/products/{productOrderId}:
 *   delete:
 *     summary: delete product_order
 *     tags:
 *       - ProductOrder
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         type: integer
 *         description: id for order resource
 *       - name: productOrderId
 *         in: path
 *         required: true
 *         type: integer
 *         description: id for product_order resource
 *     responses:
 *       200:
 *         description: OK
 */
exports.deleteProductOrder = async (req, res) => {
  try {
    const { orderId, productOrderId } = req.params;

    // check if user has access to this resource
    const access = await checkOrderUserAccess(orderId, req.user.id);
    if (!access[0] === 200)
      return res.status(access[0]).json({ error: access[1] });

    // check product order with id.
    const productOrder = await ProductOrder.findOne({
      where: { id: productOrderId, orderId: orderId }
    });
    if (!productOrder)
      return res
        .status(404)
        .json({ error: "product order with id doesn't exists" });

    await productOrder.destroy();

    res.status(200).json({ success: true, data: productOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
