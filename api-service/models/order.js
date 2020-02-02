"use strict";
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      userId: DataTypes.INTEGER
    },
    {
      tableName: "order"
    }
  );
  Order.associate = function(models) {
    Order.belongsTo(models.User);
    Order.hasMany(models.ProductOrder);
  };
  return Order;
};
