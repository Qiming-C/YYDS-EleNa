let graph = require("./walkModel");
let path = require("ngraph.path");
const haversine = require("haversine");

let { harversine_heuristic } = require("./heuristic");

function checkGraph() {
  graph.forEachNode((node) => {
    console.log(node.data);
  });
}

function findShortestPath(source, target) {
  let pathFinder = path.aStar(graph, {
    oriented: true,
    distance(fromNode, toNode, link) {
      return link.data.distance;
    },
    heuristic(fromNode, toNode) {
      return harversine_heuristic(fromNode, toNode);
    },
  });

  //path is going backward order
  let shortestPath = pathFinder.find(source, target);

  return shortestPath;
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
    (linkedNode) => {
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

function calculateRequestPath(source, target, percentage, isMax) {
  let closest = closestNode(source, target);
  source = closest.source;
  target = closest.target;

  //compute the shortest path
  let shortestPath = findShortestPath(source, target);

  let shortestDistance = calculateDistance(shortestPath, false);

  let shortestElevationGain = calculateElevations(shortestPath, false);

  //compute the distance between two nodes, if they are 1000 meters long, we only return the shortest paths to limit the computation power

  let s = graph.getNode(source);
  let e = graph.getNode(target);

  const start = {
    latitude: s.data.coordinates[0],
    longitude: s.data.coordinates[1],
  };

  const end = {
    latitude: e.data.coordinates[0],
    longitude: s.data.coordinates[1],
  };

  let walkDistance = haversine(start, end, { unit: "meter" });

  if (shortestPath.lenght == 0) {
    return null;
  }

  if (walkDistance > 500 || shortestPath.length > 20) {
    let path = pathToEdgeBackWard(shortestPath);
    let nodes = [];
    path.forEach((path) => {
      let node = graph.getNode(path.fromId);
      nodes.push(node);
    });

    return {
      path: nodes,
      elevationGain: shortestElevationGain,
      distance: shortestDistance,
      shortestDistance: shortestDistance,
    };
  } else {
    //compute all the paths
    let paths = findAllPaths(source, target, shortestPath.length);

    //compute all the elevations
    let elevations = [];
    paths.forEach((path) => {
      let elevationGain = calculateElevations(path, true);
      elevations.push(elevationGain);
    });
    let plot = -1;
    if (isMax) {
      let current = Number.MIN_SAFE_INTEGER;
      elevations.forEach((elevation, index) => {
        let distance = calculateDistance(paths[index], true);

        if (distance <= shortestDistance * (1 + percentage)) {
          if (current <= elevation) {
            current = elevation;
            plot = index;
          }
        }
      });
    } else {
      let current = Number.MAX_SAFE_INTEGER;
      elevations.forEach((elevation, index) => {
        let distance = calculateDistance(paths[index], true);

        if (distance <= shortestDistance * (1 + percentage)) {
          if (current >= elevation) {
            current = elevation;
            plot = index;
          }
        }
      });
    }

    //return the result
    let elevationGain = elevations[plot];
    let path = paths[plot];
    let dist = calculateDistance(path, true);
    return {
      path: path,
      elevationGain: elevationGain,
      distance: dist,
      shortestDistance: shortestDistance,
    };
  }
}

/**
 *
 * @param {*} path
 * @param {*} isForward is given path in forward direction or backward direction
 * @returns
 */
function calculateElevations(path, isForward) {
  let elevation = 0;
  let edges = isForward ? pathToEdgeForWard(path) : pathToEdgeBackWard(path);
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
function calculateDistance(path, isForward) {
  let totalDistance = 0;

  //get list of edges
  let edges = isForward ? pathToEdgeForWard(path) : pathToEdgeBackWard(path);

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
function pathToEdgeBackWard(path) {
  let edges = [];

  for (let i = path.length - 1; i > 0; i--) {
    let edge = graph.getLink(path[i].id, path[i - 1].id);
    edges.push(edge);
  }
  return edges;
}

/**
 *
 * @param {*} path  the node list of graph in forward order unlike the shortest path result
 * @returns the converted edges
 */
function pathToEdgeForWard(path) {
  let edges = [];
  for (let i = 1; i < path.length; i++) {
    let edge = graph.getLink(path[i - 1].id, path[i].id);
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
