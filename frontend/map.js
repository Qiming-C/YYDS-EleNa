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
    document.getElementById("source").value = e.latlng.toString();
    counter += 1;

        if (markerOutset !== null) {
            map.removeLayer(markerOutset);
        }
        markerOutset = L.marker([parseFloat(latlng1), parseFloat(latlng2)])
        .addTo(map).bindPopup("Source!").openPopup();

    // if (localStorage.getItem("Source-latlng1") !== null && localStorage.getItem("Source-latlng2") !== null) {
    //     let l1 = localStorage.getItem("Source-latlng1");
    //     let l2 = localStorage.getItem("Source-latlng2");
    //     map.removeLayer(L.marker([parseFloat(l1), parseFloat(l2)]));
    // }

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
