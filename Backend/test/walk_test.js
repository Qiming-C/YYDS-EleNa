/* eslint-disable no-undef */
let expect = require("chai").expect;
let { WALK_settings } = require("../map/enum");
let walkService = require("../map/walkService");

describe("walk/bike/run navigation map features", async function () {
  before(async function () {
    await walkService.init(WALK_settings);
  });

  //walk data model test suites
  describe("walk data model", async function () {
    it("should have the correct number of nodes of 3278", async function () {
      expect(walkService.checkGraph()).equal(3278);
    });
  });

  //walk service test suites
  describe("walk service", async function () {
    it("should return the shortest path length ", async function () {
      expect(walkService.findShortestPath(20, 10).length).to.be.equal(28);
    });

    it("should return 14 the possible paths", function () {
      expect(walkService.findAllPaths(20, 10, 28).length).to.be.equal(14);
    });
  });

  describe("walk request with short distance max elevation gain", function () {
    let response;
    before(function () {
      let source = {
        lat: 42.396127,
        lon: -72.529714,
      };
      let target = {
        lat: 42.396571,
        lon: -72.527653,
      };
      response = walkService.calculateRequestPath(source, target, 1.5, true);
    });

    it("should process the request with not null", function () {
      expect(response).not.equal(null);
    });

    it("should process the distance under 150% percentage limit", function () {
      expect(response.distance).lessThan(response.shortestDistance * 1.5);
    });
  });

  describe("walk request with short distance min elevation gain", function () {
    let response;
    before(function () {
      let source = {
        lat: 42.396127,
        lon: -72.529714,
      };
      let target = {
        lat: 42.396571,
        lon: -72.527653,
      };
      response = walkService.calculateRequestPath(source, target, 1.5, false);
    });

    it("should process the request with not null", function () {
      expect(response).not.equal(null);
    });

    it("should process the distance under 150% percentage limit", function () {
      expect(response.distance).lessThan(response.shortestDistance * 1.5);
    });
  });

  describe("walk request with long distance", function () {
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
      response = walkService.calculateRequestPath(source, target, 1.5, true);
    });

    it("should process the request with not null", function () {
      expect(response).not.equal(null);
    });

    it("should process the distance under 150% percentage limit", function () {
      expect(response.distance).lessThan(response.shortestDistance * 1.5);
    });
  });
});
