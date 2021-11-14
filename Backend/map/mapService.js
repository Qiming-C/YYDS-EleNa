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
  path = pathFinder.find(fromNodeId, toNodeId);
  console.log(path);
  graph.forEachLink((link) => {
    console.log(link);
  });
}

//TODO: DFS for finding all the paths

//TODO: Dijkstra algorithm finding the shortest path

//TODO: compute the shortest path with elevation gain awareness

module.exports = { checkGraph, findShortestPath };
