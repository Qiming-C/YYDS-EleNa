/* eslint-disable no-undef */
let expect = require("chai").expect;
let { CAR_settings } = require("../map/enum");
let carService = require("../map/mapService");

describe("vehicle navigation map features", async function () {
  before(async function () {
    await carService.init(CAR_settings);
  });

  describe("Number of nodes", async function () {
    it("should have the correct number of nodes of 1100", async function () {
      expect(carService.checkGraph()).equal(1100);
    });
  });

  describe("find the shortest path", async function () {
    let shortestPath = carService.findShortestPath(20, 10);

    it("should return the shortest path length ", async function () {
      expect(shortestPath.length).to.be.equal(15);
    });
  });
});
