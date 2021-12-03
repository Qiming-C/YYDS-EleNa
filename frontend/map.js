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

let latlngs = [
  [42.373775, -72.541988],
  [42.373775, -72.515408],
  [42.402095, -72.515408],
  [42.402095, -72.541988],
  [42.373775, -72.541988]
];

polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);


var popup = L.popup();
//source or destination record counter
var counter = 1;

//event listener when click the map
let markerOutset = null;
let markerDestination = null;

//get the OSM ID by lat and lon
function get_id(lat, lon, point) {
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + lat + "&lon=" + lon,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const storage = window.localStorage;
      let data = JSON.parse(result);
      storage.setItem(point, data.osm_id);
    })
    .catch((error) => console.log("error", error));
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

  //set the turns of filling the latlng to the source or destination input fields
  if (counter == 1) {

    var violetIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    document.getElementById("source").value = e.latlng.toString().replace("LatLng(", "").replace(")", "");
    counter += 1;

    if (markerOutset !== null) {
      map.removeLayer(markerOutset);
    }
    markerOutset = L.marker([parseFloat(latlng1), parseFloat(latlng2)], { icon: violetIcon })
      .addTo(map)
      .bindPopup("outset!")
      .openPopup();

    get_id(latlng1, latlng2, "outset");

  } else {

    var redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });


    document.getElementById("destination").value = e.latlng.toString().replace("LatLng(", "").replace(")", "");
    counter -= 1;

    if (markerDestination !== null) {
      map.removeLayer(markerDestination);
    }

    markerDestination = L.marker([parseFloat(latlng1), parseFloat(latlng2)], { icon: redIcon })
      .addTo(map)
      .bindPopup("Destination!")
      .openPopup();

    get_id(latlng1, latlng2, "Destination");
  }
}
map.on("click", onMapClick);
