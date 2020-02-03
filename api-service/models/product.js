"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER
    },
    {
      tableName: "products"
    }
  );
  // Product.associate = function(models) {};
  return Product;
};
