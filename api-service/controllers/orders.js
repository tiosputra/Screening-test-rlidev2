const { Order } = require("../models");

/**
 * @swagger
 *
 * /orders:
 *   get:
 *     summary: "get all order"
 *     tags:
 *       - Orders
 *     description: "THIS IS TESTING PURPOSE ONLY, IN THE FUTURE ONLY ADMIN CAN ACCESS THIS ENDPOINT"
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         desription: "OK"
 */
exports.getAllOrders = async (req, res) => {
  try {
    // get order data by id from param
    const orders = await Order.findAll();

    // check if order data belongs to authenticated user (authorization)
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 *
 * /orders/{id}:
 *   get:
 *     summary: "get order by id"
 *     tags:
 *       - Orders
 *     description: "get order data by id"
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: id of order you want to find
 *     responses:
 *       200:
 *         desription: "OK"
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // get order data by id from param
    const order = await Order.findOne({ where: { id: id } });

    // if there is no order by id
    if (!order)
      return res.status(404).json({ error: "Order with id not found" });

    // check if order data belongs to authenticated user (authorization)
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 *
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: "Create order"
 *     description: "create order for container product order"
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         desription: "OK"
 *
 */
exports.createOrder = async (req, res) => {
  try {
    // create order
    const order = await Order.create({ userId: req.user.id });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: "Delete order with id"
 *     tags:
 *       - Orders
 *     produces: "application/json"
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         type: integer
 *         required: true
 *         description: id you want to delete
 *     responses:
 *       200:
 *         desription: "OK"
 */
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // check if the order with id exists
    const order = await Order.findOne({ where: { id: id } });
    if (!order)
      return res.status(404).json({ error: "order with id not exists" });

    await order.destroy();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
