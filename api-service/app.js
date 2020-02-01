const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");
const swaggerSpec = require("./config/swaggerSpec");

const app = express();

let PORT = process.env.PORT || 5000;

// load passport configuration
require("./config/passport")(passport);

// app middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

// swagger routes
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// app routes
app.use("/api/v1/", require("./routes"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/products", require("./routes/products"));
app.use("/api/v1/orders", require("./routes/orders"));

// get swagger generated json
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

if (process.env.NODE_ENV === "test") PORT = 5001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
