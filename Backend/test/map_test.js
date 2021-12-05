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
    it("should return the shortest path nodes", async function () {
      expect(carService.findShortestPath(60, 10).length).to.be.equal(44);
    });

    it("should return 379 the possible paths with depth limitation", function () {
      expect(carService.findAllPaths(60, 10, 44).length).to.be.equal(379);
    });

    it("should return 1002 the possible paths without depth limitation", function () {
      expect(carService.findAllPaths(60, 10).length).to.be.equal(1002);
    });
  });

  describe("vehicle request max elevation gain", function () {
    let response;
    before(function () {
      let source = {
        lat: 42.3997,
        lon: -72.5298,
      };
      let target = {
        lat: 42.3959,
        lon: -72.5243,
      };
      response = carService.calculateRequestPath(source, target, 1.5, true);
    });

    it("should process the request with not null", function () {
      expect(response).not.equal(null);
    });

    it("should process the distance under 150% percentage limit", function () {
      expect(response.distance).lessThan(response.shortestDistance * 1.5);
    });
  });

  describe("vehicle request min elevation gain", function () {
    let response;
    before(function () {
      let source = {
        lat: 42.3997,
        lon: -72.5298,
      };
      let target = {
        lat: 42.3959,
        lon: -72.5243,
      };
      response = carService.calculateRequestPath(source, target, 1.5, false);
    });

    it("should process the request with not null", function () {
      expect(response).not.equal(null);
    });

    it("should process the distance under 150% percentage limit", function () {
      expect(response.distance).lessThan(response.shortestDistance * 1.5);
    });
  });
});
