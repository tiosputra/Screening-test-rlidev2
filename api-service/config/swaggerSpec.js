const swaggerJSDoc = require("swagger-jsdoc");

// swagger configuration
const options = {
  definition: {
    swagger: "2.0",
    info: {
      title: "Project for screening test RLIDev2",
      version: "1.0.0"
    },
    host: `localhost:81`,
    basePath: "/api/v1",
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header"
      }
    },
    tags: [
      {
        name: "Authentication",
        description:
          "API login and register user, here you can get the access token needed"
      },
      {
        name: "Products",
        description: "API for Products"
      },
      {
        name: "Orders",
        description:
          "API for Orders : After creating product a user can create order just by passing access token"
      },
      {
        name: "ProductOrder",
        description:
          "API for ProductOrder : after creating order a user can create product order"
      }
    ]
  },

  apis: ["./controllers/*.js"]
};

module.exports = swaggerJSDoc(options);
