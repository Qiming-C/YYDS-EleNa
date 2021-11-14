const southWest = L.latLng(42.373775, -72.541988),
  northEast = L.latLng(42.402095, -72.515408),
  bounds = L.latLngBounds(southWest, northEast);

let map = L.map("map", {
  maxBounds: bounds, // Then add it here..
  maxZoom: 18,
  minZoom: 15,
}).setView([42.391155, -72.526711], 15);

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery Â© <a href="https://www.mapbox.com/">Mapbox</a>';

const tiles = L.tileLayer(
  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=VaXyNVlm8KSGL6fZ5bG8",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
  }
);
tiles.addTo(map);

var popup = L.popup();
//source or destination record counter
var counter = 1;

//event listener when click the map
let markerOutset = null;
let markerDestination = null;

//get the OSM ID by lat and lon
function get_id(lat, lon) {
  let OSMID = null;
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    "https://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + lon,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const myArray = result.split(" ");
      for (let i in myArray) {
        if (myArray[i].startsWith("osm_id")) {
          const osmId = myArray[i].replace(";", "").split("=");
          console.log(osmId[0] + ": " + osmId[1]);
          OSMID = osmId[1];
        }
      }
    })
    .catch((error) => console.log("error", error));

  return OSMID;
}

function onMapClick(e) {
  var latlng1 = 0;
  var latlng2 = 0;
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
  //get latlngs
  const words = e.latlng.toString().replace("LatLng(", "").split(",");
  latlng1 = words[0].replace(/\s/g, "");
  latlng2 = words[1].replace(/\s/g, "").replace(")", "");

  get_id(latlng1, latlng2);

  //set the turns of filling the latlng to the source or destination input fields
  if (counter == 1) {
    document.getElementById("source").value = e.latlng.toString();
    counter += 1;

    if (markerOutset !== null) {
      map.removeLayer(markerOutset);
    }
    markerOutset = L.marker([parseFloat(latlng1), parseFloat(latlng2)])
      .addTo(map)
      .bindPopup("Source!")
      .openPopup();
  } else {
    document.getElementById("destination").value = e.latlng.toString();
    counter -= 1;

    if (markerDestination !== null) {
      map.removeLayer(markerDestination);
    }

    markerDestination = L.marker([parseFloat(latlng1), parseFloat(latlng2)])
      .addTo(map)
      .bindPopup("Destination!")
      .openPopup();
  }
}
map.on("click", onMapClick);
