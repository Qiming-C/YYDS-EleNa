/* eslint-disable no-undef */
let expect = require("chai").expect;
let { CAR_settings } = require("../map/enum");
let carService = require("../map/mapService");

describe("vehicle navigation map features", async function () {
  before(async function () {
    await carService.init(CAR_settings);
  });

  //car data model test suites
  describe("car data model", async function () {
    it("should have the correct number of nodes of 1100", async function () {
      expect(carService.checkGraph()).equal(1100);
    });
  });

  //vehicle service test suites
  describe("vehicle service", async function () {
    it("should return the shortest path length ", async function () {
      expect(carService.findShortestPath(20, 10).length).to.be.equal(15);
    });
  });
});
