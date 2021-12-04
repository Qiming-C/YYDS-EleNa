const UMA_BOX = [-72.5381, 42.375, -72.5168, 42.398];
const CAR_HIGHWAY = [
  "primary",
  "motorway",
  "secondary",
  "tertiary",
  "unclassified",
  "residential",
  "trunk",
  "service",
  "road",
  "primary_link",
  "trunk_link",
  "secondary_link",
  "tertiary_link",
];

const PEDESTRAIN_HIGHWAY = [
  "pedestrian",
  "residential",
  "service",
  "footway",
  "crossing",
  "path",
  "sidewalk",
  "road",
  "tertiary",
  "secondary",
  "living_street",
  "steps",
  "track",
  "oppsite_track",
];

//configuration for bounding box
const WALK_settings = {
  // Define my settings
  bbox: UMA_BOX,
  highways: PEDESTRAIN_HIGHWAY,
  timeout: 1000000000,
  maxContentLength: 2500000000,
};

//configuration for bounding box
const CAR_settings = {
  // Define my settings
  bbox: UMA_BOX,
  highways: CAR_HIGHWAY,
  timeout: 2000000000,
  maxContentLength: 3000000000,
};

module.exports = { WALK_settings, CAR_settings };
