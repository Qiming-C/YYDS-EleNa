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
  });
});
