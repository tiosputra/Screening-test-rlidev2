const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");

const app = express();

// load passport configuration
require("./config/passport")(passport);

// app middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// swagger routes
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// app routes
app.use("/api/v1/", require("./routes"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/products", require("./routes/products"));

module.exports = app;
