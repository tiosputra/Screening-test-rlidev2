const swaggerJSDoc = require("swagger-jsdoc");

// swagger configuration
const options = {
  definition: {
    swagger: "2.0",
    info: {
      title: "Project for screening test RLIDev2",
      version: "1.0.0"
    },
    host: `localhost`,
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
        description: "API for Orders"
      },
      {
        name: "ProductOrder",
        description: "API for ProductOrder"
      }
    ]
  },

  apis: ["./controllers/*.js"]
};

module.exports = swaggerJSDoc(options);
