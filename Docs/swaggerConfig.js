const swaggerJsdoc = require("swagger-jsdoc");

const definition = {
  info: {
    openapi: "3.0.0",
    title: "CELOBACKEND APPLICATION",
    description: "This is an application build on celo blockchain",
    contact: { name: "API Support", email: "cjnjenga@gmail.com" },
    version: "1.0.0"
  },
  host: `${process.env.HOST}:${process.env.PORT}`,
  schemes: ["http", "https"],
  basePath: "/api/v1",
  tags: [
    {
      name: "Account",
      description:
        "This should allow users to create `WALLET ADDRESS AND THEIR PRIVATE KEY`."
    },
    {
      name: "Transaction",
      description:
        "This sholud allow users to transact `DEPOSIT WITHDRAW TRANSFER`"
    }
  ],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      in: "header",
      name: "Authorization"
    }
  }
};

const options = {
  definition,
  apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options);
// console.log(specs)
module.exports = specs;
