const express = require("express");
const mapRouter = express.Router();
const mapService = require("./mapService");
/**
 * route for computing the maximum elevation gain route
 * @Body: The start node coordinates with osmId
 * The end node coordinates with osmId
 * The percentage of the shorest path from 0-100
 * JSON TEMPLATE
 * 
 * {
  "start": {
    "coordinates": [
      -83,
      42
    ],
    "osmId": 23423
  },
  "end": {
    "coordinates": [
      -73,
      42
    ],
    "osmId": 32938
  },
  "percentage": 50
}
 * NOTES: remember to cat data to proper type 
 */
mapRouter.post("/max", async (req, res) => {
  //mapService.findShortestPath();
  let list = mapService.findAllPaths(2, 20);
  console.log(list);
  res.send("Processed");
});

mapRouter.post("/min", async (req, res) => {
  console.log(req.body);
  res.send("Processed");
});

module.exports = mapRouter;
