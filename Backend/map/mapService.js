let graph = require("./mapModel");

function checkGraph() {
  graph.forEachNode((node) => {
    console.log(node.data);
  });
}

//TODO: DFS for finding all the paths

//TODO: Dijkstra algorithm finding the shortest path

//TODO: compute the shortest path with elevation gain awareness

module.exports = { checkGraph };
