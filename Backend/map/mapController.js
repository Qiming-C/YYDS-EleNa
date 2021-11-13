const express = require("express");
const mapRouter = express.Router();
const mapService = require("./mapService");
const mySettings = {
  // Define my settings
  bbox: [-71.0309, 42.26187, -71.02721, 42.26429],
  highways: ["primary", "secondary", "tertiary", "residential"],
  timeout: 600000000,
  maxContentLength: 1500000000,
};

mapRouter.get("/", async (req, res) => {
  let graph = await mapService.generateGraph(mySettings);
  res.send(graph);
});

module.exports = mapRouter;
