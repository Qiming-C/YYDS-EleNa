/* eslint-disable no-undef */
let expect = require("chai").expect;
let { CAR_settings } = require("../map/enum");
let { generateGraph } = require("../map/mapModel");
let createGraph = require("ngraph.graph");

let graph = createGraph();
describe("car map", async function () {
  before(async function () {
    await generateGraph(CAR_settings, graph);
  });

  describe("number of nodes", async function () {
    it("should have the correct number of nodes of 1100", async function () {
      let i = 0;
      graph.forEachNode(() => {
        i++;
      });

      expect(i).equal(1100);
    });
  });
});
