const graphFromOsm = require("graph-from-osm");
const haversine = require("haversine");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
let createGraph = require("ngraph.graph");

//actual graph we are constructing
let graph = createGraph();
//g for holding the original parse data from osm
let g = null;

//covert OSM xml data into json like graph structure
//and convert to actual graph data structure
async function generateGraph(settings) {
  const osmData = await graphFromOsm.getOsmData(settings); // Import OSM raw data
  g = graphFromOsm.osmDataToGraph(osmData); // Here is your graph
  //filter out the geometry type with point which is node
  let points = g.features.filter((obj) => obj.geometry.type === "Point");
  let ways = g.features.filter((obj) => obj.geometry.type === "LineString");
  //add vertices
  points.forEach((node) => {
    graph.addNode(node.id, {
      //flip the coordinates ,since it is oppsites of the position
      coordinates: [node.geometry.coordinates[1], node.geometry.coordinates[0]],
      osmId: node.properties.osmId,
    });
  });

  //add elevation information to vertices
  let elevations = await getElevations();
  let index = 0;
  graph.forEachNode((node) => {
    node.data.elevation = elevations.results[index++].elevation;
  });

  //add edges
  ways.forEach((way) => {
    //two nodes coordinates
    //
    let start = {
      latitude: graph.getNode(way.src).data.coordinates[0],
      longitude: graph.getNode(way.src).data.coordinates[1],
    };

    let end = {
      latitude: graph.getNode(way.tgt).data.coordinates[0],
      longitude: graph.getNode(way.tgt).data.coordinates[1],
    };

    let distance = haversine(start, end, { unit: "meter" });
    graph.addLink(way.src, way.tgt, { distance: distance });
  });

  //TODO: add elevation gain between edges

  return graph;
}

/**
 * Sending the http request to get the elevation gain
 * @returns the lists of all nodes elevation gain
 */
async function getElevations() {
  let body = {
    locations: [],
  };

  graph.forEachNode((node) => {
    body.locations.push({
      latitude: node.data.coordinates[0],
      longitude: node.data.coordinates[1],
    });
  });

  //send post request to retrieve elevation information
  let response = await fetch("https://api.open-elevation.com/api/v1/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return await response.json();
}

module.exports = { generateGraph, getElevations };
