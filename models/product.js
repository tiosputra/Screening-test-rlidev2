"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      stock: DataTypes.INTEGER
    },
    {}
  );
  Product.associate = function(models) {};
  return Product;
};
