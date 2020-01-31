const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();

// load passport configuration
require("./config/passport")(passport);

// app middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app routes
app.use("/", require("./routes"));
app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));

module.exports = app;
