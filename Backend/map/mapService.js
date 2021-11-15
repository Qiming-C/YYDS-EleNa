let graph = require("./mapModel");
let path = require("ngraph.path");

function checkGraph() {
  graph.forEachNode((node) => {
    console.log(node.data);
  });
}

//TODO: A* algorithm
function findShortestPath() {
  //73048441
  let fromNodeId = 2;
  //73114243
  let toNodeId = 20;

  let pathFinder = path.aStar(graph, {
    distance(fromNode, toNode, link) {
      return link.data.distance;
    },
  });

  //path is going backward order
  let shortestPath = pathFinder.find(fromNodeId, toNodeId);
}

//TODO: DFS for finding all the paths
function findAllPaths(source, target) {
  //boolean type for checking if node is visisted
  let isVisited = [];
  //store the path
  let pathList = [];

  //add source node to path
  pathList.push(source);

  //call util dfs
  DFSutils(source, target, isVisited, pathList);
}

function DFSUtils(source, target, isVisited, pathList) {
  //check if two node are equal
  // if (source.id === target.id) {
  //   console.log(pathList);
  //   return;
  // }

  //mark the current node to be visited
  //isVisited[source.id] = true;

  //recursive for all the neighbors
  graph.forEachLinkedNode(6, (linkedNode, link) => {
    console.log("Connected node:", linkedNode.id, linkedNode.data);
    console.dir(link);
  });
}

//TODO: Dijkstra algorithm finding the shortest path

//TODO: compute the shortest path with elevation gain awareness

module.exports = { checkGraph, findShortestPath, DFSUtils };
