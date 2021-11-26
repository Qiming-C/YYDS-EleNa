let graph = require("./mapModel");
let path = require("ngraph.path");

function checkGraph() {
  graph.forEachNode((node) => {
    console.log(node.data);
  });
}

//TODO: A* algorithm
//FIXME: need to sync the progress otherwise when user click too quick while server is up will cause some unfinish graph issue
function findShortestPath(source, target) {
  //find the closest node

  let pathFinder = path.aStar(graph, {
    oriented: true,
    distance(fromNode, toNode, link) {
      return link.data.distance;
    },
    heuristic(fromNode, toNode) {
      return toNode.data.elevation - fromNode.data.elevation;
    },
  });

  //path is going backward order
  let shortestPath = pathFinder.find(source, target);

  let elevationGain = calculateElevations(shortestPath);
  let distance = calculateDistance(shortestPath);
  console.dir(shortestPath);

  console.log(`total elevation gain: ${elevationGain} m`);
  console.log(`total distance gain:  ${distance} m`);

  return {
    path: shortestPath,
    distance: distance,
    elevationGain: elevationGain,
  };
}

/**
 *
 * @param {*} source
 * @param {*} target
 * @returns return a list of path from source to target node
 */
function findAllPaths(source, target, maxLength) {
  //boolean type for checking if node is visisted
  let verticeCount = 0;
  graph.forEachNode(function () {
    verticeCount++;
  });

  //fetch sourced node and target node first
  let s = graph.getNode(source);
  let t = graph.getNode(target);

  let isVisited = new Array(verticeCount).fill(false);
  //store the path
  let pathList = [];
  let final = [];

  //add source node to path
  pathList.push(s);

  //call util dfs
  DFSUtils(s, t, isVisited, pathList, final, maxLength);
  return final;
}

/**
 *
 * @param {*} source
 * @param {*} target
 * @param {*} isVisited
 * @param {*} pathList
 * @param {*} final
 * @param {*} maxLength  the maximum length of the path, to prevent the exponential growths
 * @returns
 */
function DFSUtils(source, target, isVisited, pathList, final, maxLength) {
  //check if two node are equal
  if (source === target) {
    final.push([...pathList]);
    return;
  }

  //if exceed the maxLength we still not found the target, we return immediately
  if (source !== target && pathList.length >= maxLength) {
    return;
  }

  // mark the current node to be visited
  isVisited[source.id] = true;

  // get the adjacent list
  let adjacent = [];
  //TRUE indicates we only want the outgoing edge
  graph.forEachLinkedNode(
    source.id,
    (linkedNode, link) => {
      adjacent.push(linkedNode);
    },
    true
  );

  for (let i = 0; i < adjacent.length; i++) {
    if (!isVisited[adjacent[i].id]) {
      //store current node to pathList
      pathList.push(adjacent[i]);
      DFSUtils(adjacent[i], target, isVisited, pathList, final, maxLength);

      //backtracking
      pathList.splice(pathList.indexOf(adjacent[i]), 1);
    }
  }

  //mark the current node to unvisited
  isVisited[source.id] = false;
}

/**
 *
 * @param {*} source source node with lat and lon
 * @param {*} target target node with lat and lon
 * @returns the source and target id in the graph data strcuture
 */
function closestNode(source, target) {
  let sourceMin = Number.MAX_SAFE_INTEGER,
    targetMin = Number.MAX_SAFE_INTEGER,
    sourceId = "",
    targetId = "";

  graph.forEachNode((node) => {
    if (
      sourceMin >
      Math.abs(node.data.coordinates[0] - source.lat) +
        Math.abs(node.data.coordinates[1] - source.lon)
    ) {
      sourceMin =
        Math.abs(node.data.coordinates[0] - source.lat) +
        Math.abs(node.data.coordinates[1] - source.lon);
      sourceId = node.id;
    }
    if (
      targetMin >
      Math.abs(node.data.coordinates[0] - target.lat) +
        Math.abs(node.data.coordinates[1] - target.lon)
    ) {
      targetMin =
        Math.abs(node.data.coordinates[0] - target.lat) +
        Math.abs(node.data.coordinates[1] - target.lon);
      targetId = node.id;
    }
  });

  return { source: sourceId, target: targetId };
}

//TODO: compute the shortest path with elevation gain awareness
function calculateRequestPath(source, target, percentage, isMax) {
  let closest = closestNode(source, target);
  source = closest.source;
  target = closest.target;

  //compute the shortest path
  let shortestPath = findShortestPath(source, target);
  let maxLength = shortestPath.path.length + 1;

  //compute all the paths
  let paths = findAllPaths(source, target, maxLength);

  //compute all the distance
  let distances = [];
  paths.forEach((path) => {
    distances.push(calculateDistance(path));
  });

  console.log(distances);
}

//TODO: compute the elevations gain with given path
function calculateElevations(path) {
  let elevation = 0;
  let edges = pathToEdge(path);

  edges.forEach((edge) => {
    if (edge.data.elevation > 0) {
      elevation += edge.data.elevation;
    }
  });

  return elevation;
}

/**
 *
 * @param {*} path the path as list of node
 *
 */
function calculateDistance(path) {
  let totalDistance = 0;

  //get list of edges
  let edges = pathToEdge(path);

  edges.forEach((edge) => {
    totalDistance += edge.data.distance;
  });

  return totalDistance;
}

/**
 *
 * @param {*} path the node list of path
 * @return {array} the list of connected edges
 * @Purpose: given the shortest path, it is reverse order of nodes
 * this function will have return the list of edges instead of individual nodes
 * AND IT WILL BE IN ORDER FROM SOURCE EDGE, TO TARGET EDGE
 */
function pathToEdge(path) {
  let edges = [];

  for (let i = path.length - 1; i > 0; i--) {
    let edge = graph.getLink(path[i].id, path[i - 1].id);
    edges.push(edge);
  }
  return edges;
}

module.exports = {
  checkGraph,
  findShortestPath,
  DFSUtils,
  findAllPaths,
  calculateRequestPath,
};
