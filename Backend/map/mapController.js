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
    ]
  },
  "end": {
    "coordinates": [
      -73,
      42
    ]
  },
  "percentage": 50
}
 * NOTES: remember to cat data to proper type 
 */

mapRouter.post("/max", async (req, res) => {
  //flip the coordinates
  let source = {
    lat: req.body.start.coordinates[1],
    lon: req.body.start.coordinates[0],
  };
  let target = {
    lat: req.body.end.coordinates[1],
    lon: req.body.end.coordinates[0],
  };

  mapService.calculateRequestPath(source, target, 100);
  res.status(200).json("processed");
});

mapRouter.post("/min", async (req, res) => {
  console.log(req.body);
  res.send("Processed");
});

module.exports = mapRouter;
