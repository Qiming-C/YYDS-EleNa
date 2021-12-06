const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const port = 3000;
const mapRouter = require("./map/mapController");
const cors = require("cors");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "YYDS-Elena API",
      description: "Map servcie api",
      contact: {
        name: "YYDS developer",
      },
      servers: ["http://localhost:3000"],
    },
  },
  //['.routes/*.js']
  apis: ["./map/mapController.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/map/", mapRouter);

app.get("/", (req, res) => {
  res.send("this is yyds");
});

app.listen(port, async () => {
  console.log("server is up running");
});
