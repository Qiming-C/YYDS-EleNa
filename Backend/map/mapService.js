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
  let closestNodes = closestNode(source, target);

  let fromNodeId = closestNodes.source;

  let toNodeId = closestNodes.target;

  let pathFinder = path.aStar(graph, {
    distance(fromNode, toNode, link) {
      return link.data.distance;
    },
    heuristic(fromNode, toNode) {
      return toNode.data.elevation - fromNode.data.elevation;
    },
  });

  //path is going backward order
  let shortestPath = pathFinder.find(fromNodeId, toNodeId);
  let elevationGain = calculateElevations(shortestPath);
  let distance = calculateDistance(shortestPath);
  console.dir(shortestPath);

  console.log(`total elevation gain: ${elevationGain} m`);
  console.log(`total distance gain:  ${distance} m`);

  //convert to edges
  let edges = pathToEdge(shortestPath);

  return {
    path: edges,
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
function findAllPaths(source, target) {
  //boolean type for checking if node is visisted
  let verticeCount = 0;
  graph.forEachNode(function () {
    verticeCount++;
  });

  //get the closest vertice from given points
  let closeId = closestNode(source, target);

  //fetch sourced node and target node first
  let s = graph.getNode(closeId.source);
  let t = graph.getNode(closeId.target);

  let isVisited = new Array(verticeCount).fill(false);
  //store the path
  let pathList = [];
  let final = [];

  //add source node to path
  pathList.push(s);

  //call util dfs
  DFSUtils(s, t, isVisited, pathList, final);
  return final;
}

function DFSUtils(source, target, isVisited, pathList, final) {
  //check if two node are equal
  if (source === target) {
    final.push([...pathList]);
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
    if (!isVisited[adjacent[i]]) {
      //store current node to pathList
      pathList.push(adjacent[i]);
      DFSUtils(adjacent[i], target, isVisited, pathList, final);

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

//TODO: compute the elevations gain with given path
function calculateElevations(path) {
  let elevation = 0;
  let prev = path[path.length - 1];
  for (let i = path.length - 2; i > 0; i--) {
    let curElevation = prev - path[i];
    prev = path[i];

    if (curElevation > 0) {
      elevation += curElevation;
    }
  }
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

module.exports = { checkGraph, findShortestPath, DFSUtils, findAllPaths };
