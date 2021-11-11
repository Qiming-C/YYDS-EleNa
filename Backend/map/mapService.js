const graphFromOsm = require("graph-from-osm");

async function generateGraph(settings) {
  const osmData = await graphFromOsm.getOsmData(settings); // Import OSM raw data
  const graph = graphFromOsm.osmDataToGraph(osmData); // Here is your graph
  return graph;
}

module.exports = { generateGraph };
