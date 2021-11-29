const graphFromOsm = require("graph-from-osm");
const haversine = require("haversine");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
let createGraph = require("ngraph.graph");

const UMA_BOX = [-72.5381, 42.375, -72.5168, 42.398];
const CAR_HIGHWAY = [
  "primary",
  "motorway",
  "secondary",
  "tertiary",
  "unclassified",
  "residential",
  "trunk",
  "service",
  "road",
  "primary_link",
  "trunk_link",
  "secondary_link",
  "tertiary_link",
];

//configuration for bounding box
const settings = {
  // Define my settings
  bbox: UMA_BOX,
  highways: CAR_HIGHWAY,
  timeout: 2000000000,
  maxContentLength: 3000000000,
};

//actual graph we are constructing
let graph = createGraph();
//g for holding the original parse data from osm
let g = null;
generateGraph(settings);

//covert OSM xml data into json like graph structure
//and convert to actual graph data structure
async function generateGraph(settings) {
  const osmData = await graphFromOsm.getOsmData(settings); // Import OSM raw data

  g = graphFromOsm.osmDataToGraph(osmData); // Here is your graph

0

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

    let start = {
      latitude: graph.getNode(way.src).data.coordinates[0],
      longitude: graph.getNode(way.src).data.coordinates[1],
    };

    let end = {
      latitude: graph.getNode(way.tgt).data.coordinates[0],
      longitude: graph.getNode(way.tgt).data.coordinates[1],
    };

    let distance = haversine(start, end, { unit: "meter" });

    //check if the road is one way
    if (way.properties.tags.oneway && way.properties.tags.oneway == "yes") {
      graph.addLink(way.src, way.tgt, { distance: distance });
    } else if (
      !way.properties.tags.oneway ||
      way.properties.tags.oneway == "no"
    ) {
      graph.addLink(way.src, way.tgt, { distance: distance });
      graph.addLink(way.tgt, way.src, { distance: distance });
    }
  });

  graph.forEachLink((link) => {
    let node1 = graph.getNode(link.fromId);
    let node2 = graph.getNode(link.toId);
    let elevation = node2.data.elevation - node1.data.elevation;
    link.data.elevation = elevation;
  });

  console.log("number of node" + index);
  console.log("Car Graph is generated ");
}

/**
 * Sending the http request to get the elevation gain
 * The open elevation Api only supports 230 nodes per request
 * This function will fetch serveral times in order to get the complete elevation
 * @returns the lists of all nodes elevation gain
 */
async function getElevations() {
  let answer = {
    results: [],
  };

  let locations = [];

  graph.forEachNode((node) => {
    locations.push({
      latitude: node.data.coordinates[0],
      longitude: node.data.coordinates[1],
    });
  });

  //request time = body length / 200
  let time = Math.round(locations.length / 200);

  for (let i = 0; i < time; i++) {
    let temp = locations.slice(i * 200, (i + 1) * 200);
    let body = {
      locations: temp,
    };

    //send post request to retrieve elevation information
    let response = await fetch("https://api.open-elevation.com/api/v1/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let result = await response.json();

    answer.results.push(...result.results);
  }

  //there will be leftover node not being returned
  if (locations.length > time * 200) {
    let temp = locations.slice(time * 200, locations.length);
    let body = {
      locations: temp,
    };
    //send post request to retrieve elevation information
    let response = await fetch("https://api.open-elevation.com/api/v1/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let result = await response.json();

    answer.results.push(...result.results);
  }

  return answer;
}

module.exports = graph;
