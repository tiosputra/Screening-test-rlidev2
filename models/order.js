"use strict";
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      userId: DataTypes.INTEGER
    },
    {}
  );
  Order.associate = function(models) {
    Order.belongsTo(models.User);
  };
  return Order;
};
