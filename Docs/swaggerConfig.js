const swaggerJsdoc = require("swagger-jsdoc");

const definition = {
  info: {
    title: "PesabaseContractKit Application",
    description: "This is an application build on celo blockchain",
    openapi: "3.0.0",
    termsOfService: "http://swagger.io/terms/",
    contact: { name: "API Support", email: "cjnjenga@gmail.com" },
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html"
    },
    version: "1.0.0"
  },
  host: `${process.env.HOST}:${process.env.PORT}`,
  basePath: "/api/v1"
};

const options = {
  definition,
  apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options);
// console.log(specs)
module.exports = specs;
