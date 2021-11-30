const haversine = require("haversine");
let manhattan = require("manhattan-distance");

//haversine formula heuristic
function harversine_heuristic(fromNode, toNode) {
  let start = {
    latitude: fromNode.data.coordinates[0],
    longitude: fromNode.data.coordinates[1],
  };

  let end = {
    latitude: toNode.data.coordinates[0],
    longitude: toNode.data.coordinates[1],
  };

  return haversine(start, end, { unit: "meter" });
}

//normal distance formula
//best for any movements
function euclideanDistance_hueristic(fromNode, toNode) {
  let dx = fromNode.data.coordinates[0] - toNode.data.coordinates[1];
  let dy = fromNode.data.coordinates[0] - toNode.data.coordinates[1];

  return Math.sqrt(dx * dx + dy * dy);
}

//wrosen the result
//best for grid like where we have perfect grid like coordinates in the map which line among the x,y coordinates
function manhattan_heuristic(fromNode, toNode) {
  //manhattan distance
  return (
    manhattan(
      fromNode.data.coordinates[0],
      fromNode.data.coordinates[1],
      toNode.data.coordinates[0],
      toNode.data.coordinates[1]
    ).slice(0, -2) * 1000
  );
}

module.exports = {
  harversine_heuristic,
  manhattan_heuristic,
  euclideanDistance_hueristic,
};
