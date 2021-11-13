const graphFromOsm = require("graph-from-osm");
const haversine = require("haversine");
let createGraph = require("ngraph.graph");

let graph = createGraph();
//g for holding the original parse data from osm
let g = null;

//covert OSM xml data into json like graph structure
async function generateGraph(settings) {
  const osmData = await graphFromOsm.getOsmData(settings); // Import OSM raw data
  g = graphFromOsm.osmDataToGraph(osmData); // Here is your graph
  console.log(g.features);
  //filter out the geometry type with point which is node
  let points = g.features.filter((obj) => obj.geometry.type === "Point");
  let ways = g.features.filter((obj) => obj.geometry.type === "LineString");
  //add vertices
  points.forEach((node) => {
    graph.addNode(node.id, {
      coordinates: node.geometry.coordinates,
      osmId: node.properties.osmId,
    });
  });
  //TODO: need to add elevation profile to each node

  //add edges
  ways.forEach((way) => {
    //two nodes coordinates
    //
    let start = {
      latitude: graph.getNode(way.src).data.coordinates[1],
      longitude: graph.getNode(way.src).data.coordinates[0],
    };

    let end = {
      latitude: graph.getNode(way.tgt).data.coordinates[1],
      longitude: graph.getNode(way.tgt).data.coordinates[0],
    };

    let distance = haversine(start, end, { unit: "meter" });
    graph.addLink(way.src, way.tgt, { distance: distance });
  });

  return graph;
}

module.exports = { generateGraph };
