"use strict";
module.exports = (sequelize, DataTypes) => {
  const ProductOrder = sequelize.define(
    "ProductOrder",
    {
      orderId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      productId: DataTypes.INTEGER
    },
    {
      tableName: "product_order"
    }
  );
  ProductOrder.associate = function(models) {
    ProductOrder.belongsTo(models.Product);
    ProductOrder.belongsTo(models.Order);
  };
  return ProductOrder;
};
