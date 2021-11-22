let graph = require("./mapModel");
let path = require("ngraph.path");

function checkGraph() {
  graph.forEachNode((node) => {
    console.log(node.data);
  });
}

//TODO: A* algorithm
//FIXME: need to sync the progress otherwise when user click too quick while server is up will cause some unfinish graph issue
function findShortestPath() {
  //73048441
  let fromNodeId = 2;
  //73114243
  let toNodeId = 20;

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
  console.log(shortestPath);
  console.log("total elevation is " + calculateElevations(shortestPath));
}

//To find the closest node between input node to roadway node osm id
function closestNode(source, target){
  let sourceMin = 99999, targetMin = 999999, sourceId=0, targetId=0;

  graph.forEachNode((node) => {
    if(sourceMin > Math.abs(node.data.coordinates[0] - source.lat) + Math.abs(node.data.coordinates[1] - source.lon)){
      sourceMin = Math.abs(node.data.coordinates[0] - source.lat) + Math.abs(node.data.coordinates[1] - source.lon);
      sourceId = node.data.osmId;
    }
    if(targetMin > Math.abs(node.data.coordinates[0] - target.lat) + Math.abs(node.data.coordinates[1] - target.lon)){
      targetMin = Math.abs(node.data.coordinates[0] - target.lat) + Math.abs(node.data.coordinates[1] - target.lon);
      targetId = node.data.osmId;
    }
  });

  return {source: sourceId, target:targetId};
}


//TODO: DFS for finding all the paths
function findAllPaths(source, target) {
  //boolean type for checking if node is visisted
  let verticeCount = 0;
  graph.forEachNode(function (node) {
    verticeCount++;
  });

  console.log("this is check node");
  let closeId = closestNode({lat:42.261488, lon:-71.029383}, {lat:42.263394, lon:-71.029712});

  console.log(closeId);

  let isVisited = new Array(verticeCount).fill(false);
  //store the path
  let pathList = [];
  let final = [];
  //fetch sourced node and target node first
  let s = graph.getNode(source);
  let t = graph.getNode(target);

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

//TODO: Dijkstra algorithm finding the shortest path

//TODO: compute the shortest path with elevation gain awareness

//TODO: compute the elevations gain with given path
function calculateElevations(path) {
  //let elevation = 0;
  path.forEach((node) => console.log(node.data.elevation));
}

module.exports = { checkGraph, findShortestPath, DFSUtils, findAllPaths };
