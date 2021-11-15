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
  });

  //path is going backward order
  let shortestPath = pathFinder.find(fromNodeId, toNodeId);
}

//TODO: DFS for finding all the paths
function findAllPaths(source, target) {
  //boolean type for checking if node is visisted
  let verticeCount = 0;
  graph.forEachNode(function (node) {
    verticeCount++;
  });
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

module.exports = { checkGraph, findShortestPath, DFSUtils, findAllPaths };
