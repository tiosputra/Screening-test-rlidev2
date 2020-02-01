"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {
      tableName: "users"
    }
  );
  User.associate = function(models) {
    User.hasMany(models.Order);
  };
  return User;
};
