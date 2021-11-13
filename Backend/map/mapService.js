const graphFromOsm = require("graph-from-osm");
let createGraph = require("ngraph.graph");

let graph = createGraph();
//g for holding the original parse data from osm
let g = null;

async function generateGraph(settings) {
  const osmData = await graphFromOsm.getOsmData(settings); // Import OSM raw data
  g = graphFromOsm.osmDataToGraph(osmData); // Here is your graph

  convertToGraphType(g);
  return g;
}

function convertToGraphType(g) {
  //filter out the geometry type with point which is node
  let points = g.features.filter((obj) => obj.geometry.type === "Point");

  points.forEach((node) => {
    graph.addNode(node.id, { coordinates: node.geometry.coordinates });
  });
}

module.exports = { generateGraph };
