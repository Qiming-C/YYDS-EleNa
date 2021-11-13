const express = require("express");
const app = express();
const port = 3000;
const mapRouter = require("./map/mapController");
const mapService = require("./map/mapService");
const mySettings = {
  // Define my settings
  bbox: [-71.0309, 42.26187, -71.02721, 42.26429],
  highways: ["primary", "secondary", "tertiary", "residential"],
  timeout: 600000000,
  maxContentLength: 1500000000,
};

app.use(express.json());

app.use("/map", mapRouter);

app.get("/", (req, res) => {
  res.send("this is yyds");
});

app.listen(port, async () => {
  //generate the graph first
  let graph = await mapService.generateGraph(mySettings);
});
