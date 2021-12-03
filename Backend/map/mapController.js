const express = require("express");
const mapRouter = express.Router();
const mapService = require("./mapService");
const walkService = require("./walkService");
const { CAR_settings, WALK_settings } = require("./enum");

//init the services
mapService.init(CAR_settings);
walkService.init(WALK_settings);
console.log("Data has been processed successfully");
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
  "percentage": 0-1
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

  let result = mapService.calculateRequestPath(
    source,
    target,
    req.body.percentage,
    true
  );
  res.status(200).json(result);
});

mapRouter.post("/min", async (req, res) => {
  //flip the coordinates
  let source = {
    lat: req.body.start.coordinates[1],
    lon: req.body.start.coordinates[0],
  };
  let target = {
    lat: req.body.end.coordinates[1],
    lon: req.body.end.coordinates[0],
  };

  let result = mapService.calculateRequestPath(
    source,
    target,
    req.body.percentage,
    false
  );
  res.status(200).json(result);
});

mapRouter.post("/walk/max", async (req, res) => {
  //flip the coordinates
  let source = {
    lat: req.body.start.coordinates[1],
    lon: req.body.start.coordinates[0],
  };
  let target = {
    lat: req.body.end.coordinates[1],
    lon: req.body.end.coordinates[0],
  };

  let result = walkService.calculateRequestPath(
    source,
    target,
    req.body.percentage,
    true
  );
  res.status(200).json(result);
});

mapRouter.post("/walk/min", async (req, res) => {
  //flip the coordinates
  let source = {
    lat: req.body.start.coordinates[1],
    lon: req.body.start.coordinates[0],
  };
  let target = {
    lat: req.body.end.coordinates[1],
    lon: req.body.end.coordinates[0],
  };

  let result = walkService.calculateRequestPath(
    source,
    target,
    req.body.percentage,
    false
  );
  res.status(200).json(result);
});

module.exports = mapRouter;
