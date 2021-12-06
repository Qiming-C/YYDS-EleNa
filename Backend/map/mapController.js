const express = require("express");
const mapRouter = express.Router();
const mapService = require("./mapService");
const walkService = require("./walkService");
const { CAR_settings, WALK_settings } = require("./enum");

//init the services
mapService.init(CAR_settings);
walkService.init(WALK_settings);
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

/**
 * @swagger
 * tags:
 *  name: Map Routes
 * /api/map/max:
 *  post:
 *   tags: [Map Routes]
 *   description: request the maximum elevation gain
 *   consumes:
 *   - "application/json"
 *   produces:
 *   - "application/json"
 *   parameters:
 *   - in: "body"
 *     name: "body"
 *     description: "start and end point with lat,lon. percentage from 0-1"
 *     required: true,
 *     schema:
 *        type: object
 *        properties:
 *          start:
 *            type: object
 *            properties:
 *              coordinates:
 *                type: array
 *                items:
 *                  type: number
 *                default:
 *                  - -83
 *                  - 42
 *          end:
 *            type: object
 *            properties:
 *              coordinates:
 *                type: array
 *                items:
 *                  type: number
 *                default:
 *                  - -73
 *                  - 42
 *          percentage:
 *            type: number
 *            default: 0.5
 *   responses:
 *         default:
 *            description: A successful response
 *
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

  result
    ? res.status(200).json(result)
    : res.status(400).json({ message: "invalid request" });
});

/**
 * @swagger
 * tags:
 *  name: Map Routes
 * /api/map/min:
 *  post:
 *   tags: [Map Routes]
 *   description: request the minimum elevation gain
 *   consumes:
 *   - "application/json"
 *   produces:
 *   - "application/json"
 *   parameters:
 *   - in: "body"
 *     name: "body"
 *     description: "start and end point with lat,lon. percentage from 0-1"
 *     required: true,
 *     schema:
 *        type: object
 *        properties:
 *          start:
 *            type: object
 *            properties:
 *              coordinates:
 *                type: array
 *                items:
 *                  type: number
 *                default:
 *                  - -83
 *                  - 42
 *          end:
 *            type: object
 *            properties:
 *              coordinates:
 *                type: array
 *                items:
 *                  type: number
 *                default:
 *                  - -73
 *                  - 42
 *          percentage:
 *            type: number
 *            default: 0.5
 *   responses:
 *    200:
 *        description: A successful response
 *
 */
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
  result
    ? res.status(200).json(result)
    : res.status(400).json({ message: "invalid request" });
});

/**
 * @swagger
 * tags:
 *  name: Map Routes
 * /api/map/walk/max:
 *  post:
 *   tags: [Map Routes]
 *   description: request the maximum elevation gain for walking
 *   consumes:
 *   - "application/json"
 *   produces:
 *   - "application/json"
 *   parameters:
 *   - in: "body"
 *     name: "body"
 *     description: "start and end point with lat,lon. percentage from 0-1"
 *     required: true,
 *     schema:
 *        type: object
 *        properties:
 *          start:
 *            type: object
 *            properties:
 *              coordinates:
 *                type: array
 *                items:
 *                  type: number
 *                default:
 *                  - -83
 *                  - 42
 *          end:
 *            type: object
 *            properties:
 *              coordinates:
 *                type: array
 *                items:
 *                  type: number
 *                default:
 *                  - -73
 *                  - 42
 *          percentage:
 *            type: number
 *            default: 0.5
 *   responses:
 *    200:
 *        description: A successful response
 *
 */
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
  result
    ? res.status(200).json(result)
    : res.status(400).json({ message: "invalid request" });
});

/**
 * @swagger
 * tags:
 *  name: Map Routes
 * /api/map/walk/map:
 *  post:
 *   tags: [Map Routes]
 *   description: request the minimum elevation gain for walking
 *   consumes:
 *   - "application/json"
 *   produces:
 *   - "application/json"
 *   parameters:
 *   - in: "body"
 *     name: "body"
 *     description: "start and end point with lat,lon. percentage from 0-1"
 *     required: true,
 *     schema:
 *        type: object
 *        properties:
 *          start:
 *            type: object
 *            properties:
 *              coordinates:
 *                type: array
 *                items:
 *                  type: number
 *                default:
 *                  - -83
 *                  - 42
 *          end:
 *            type: object
 *            properties:
 *              coordinates:
 *                type: array
 *                items:
 *                  type: number
 *                default:
 *                  - -73
 *                  - 42
 *          percentage:
 *            type: number
 *            default: 0.5
 *   responses:
 *    200:
 *        description: A successful response
 *
 */
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
  result
    ? res.status(200).json(result)
    : res.status(400).json({ message: "invalid request" });
});

module.exports = mapRouter;
