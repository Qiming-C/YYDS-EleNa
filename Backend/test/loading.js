let carService = null;

async function getCarService() {
  if (carService) {
    return carService;
  }

  carService = await require("../map/mapService");
  return carService;
}

module.exports = {
  getCarService,
};
