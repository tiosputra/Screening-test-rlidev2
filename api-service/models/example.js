"use strict";
module.exports = (sequelize, DataTypes) => {
  const Example = sequelize.define(
    "Example",
    {
      exampleName: DataTypes.STRING
    },
    {
      tableName: "example"
    }
  );
  return Example;
};
