document.getElementById("max").addEventListener("click", max);
document.getElementById("min").addEventListener("click", min);
document.getElementById("walk").addEventListener("click", walk);
document.getElementById("car").addEventListener("click", car);
document.getElementById("go").addEventListener("click", go);
document.getElementById("Chen-github").addEventListener("click", linkToChen);
document.getElementById("Lau-github").addEventListener("click", linkToLau);
document.getElementById("Li-github").addEventListener("click", linkToLi);
document.getElementById("popup_close").addEventListener("click", () => {
  document.getElementById("popup_box").style.display = "none";
});

let type = null;
let minBt = document.getElementById("min");
let maxBt = document.getElementById("max");
let walkBt = document.getElementById("walk");
let carBt = document.getElementById("car");
const storage = window.localStorage;
let polyline = 1;
let walkOrCar = null;

function go() {
  if (
    document.getElementById("source").value === "" ||
    document.getElementById("destination").value === "" ||
    type === null ||
    walkOrCar == null
  ) {
    //popup show
    document.getElementById("pop_up_header").innerText = "Missing information";
    document.getElementById("pop_up_content").innerText =
      "Check required input before process";

    document.getElementById("popup_box").style.display = "initial";
    window.setTimeout(popup_timeout, 3000);
  } else {
    //get latlngs
    let source_l1, source_l2, des_l1, des_l2;

    //get OSM id
    const storage = window.localStorage;
    let outset = storage.getItem("outset");
    let destination = storage.getItem("Destination");

    let words = document.getElementById("source").value.split(",");
    if (words[1] !== undefined) {
      source_l1 = words[0].replace(/\s/g, "");
      source_l2 = words[1].replace(/\s/g, "");
    }

    words = document.getElementById("destination").value.split(",");
    if (words[1] !== undefined) {
      des_l1 = words[0].replace(/\s/g, "");
      des_l2 = words[1].replace(/\s/g, "");
    }

    //short
    let sliderValue = document.getElementById("myRange").value;
    sliderValue = (sliderValue - 100) / 100;

    // console.log(parseFloat(source_l1));

    let checkBool = checkInput(source_l1, source_l2, des_l1, des_l2);

    if (checkBool[0] || checkBool[1]) {
      if (checkBool[0]){
        document.getElementById("pop_up_header").innerText = "Coordinate is not number!";
        document.getElementById("pop_up_content").innerText = "Only number is acceptable for Source / Destination";
      }

      if (checkBool[1]) {
        document.getElementById("pop_up_header").innerText = "Coordinate is out of range!";
        document.getElementById("pop_up_content").innerText = "Please put the source / destination in side the red box area";
      }

      document.getElementById("popup_box").style.display = "initial";
      window.setTimeout(popup_timeout, 3000);
    } else {
      buildMap();

      // raw data set
      const raw = {
        start: {
          coordinates: [source_l2, source_l1],
          osmId: outset,
        },
        end: {
          coordinates: [des_l2, des_l1],
          osmId: destination,
        },
        percentage: sliderValue,
      };

      // call backend fetch data for node
      postData(raw, type, walkOrCar);
    }
  }
}

function checkInput(s1, s2, d1, d2) {
  let bool = [false, false];

  if (isNaN(s1) || isNaN(s2) || isNaN(d1) || isNaN(d2)) bool[0] = true;

  if (parseFloat(s1) < 42.373775 || parseFloat(s1) > 42.402095) bool[1] = true;

  if (parseFloat(d1) < 42.373775 || parseFloat(d1) > 42.402095) bool[1] = true;

  if (parseFloat(s2) < -72.541988 || parseFloat(s2) > -72.515408)
    bool[1] = true;

  if (parseFloat(d2) < -72.541988 || parseFloat(d2) > -72.515408)
    bool[1] = true;

  return bool;
}

async function postData(JSONData, maxOrMin, walkOrCar) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(JSONData),
  };

  if (walkOrCar !== "") {
    walkOrCar += "/";
  }
  fetch(
    "http://localhost:3000/api/map/" + walkOrCar + maxOrMin,
    requestOptions
  ).then(async (response) => {
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      if (data.path.length === 0) {
        alert("No path");
        document.getElementById("table_distance").innerHTML = "";
        document.getElementById("table_elevation").innerHTML = "";
        document.getElementById("table_percentage").innerHTML = "";
        document.getElementById("table_node").innerHTML = "";
      } else {
        //render the line by dash line and line
        let node = data.path;
        let startDash = [
          [JSONData.start.coordinates[1], JSONData.start.coordinates[0]],
          [node[0].data.coordinates[0], node[0].data.coordinates[1]],
        ];

        let centerLine = [];
        for (let i = 0; i < data.path.length; i++) {
          centerLine.push([
            node[i].data.coordinates[0],
            node[i].data.coordinates[1],
          ]);
        }

        let endDash = [
          [
            node[node.length - 1].data.coordinates[0],
            node[node.length - 1].data.coordinates[1],
          ],
          [JSONData.end.coordinates[1], JSONData.end.coordinates[0]],
        ];

        let centerL = L.polyline(centerLine, {
          color: "blue",
          weight: "5",
        }).addTo(map);

        let startL = L.polyline(startDash, {
          color: "black",
          weight: "3",
          dashArray: "5, 5",
          dashOffset: "0",
        }).addTo(map);

        let endL = L.polyline(endDash, {
          color: "black",
          weight: "3",
          dashArray: "5, 5",
          dashOffset: "0",
        }).addTo(map);
        //////  end of render line //////

        //render the route info to table
        let type = "";
        if (walkOrCar == "") {
          type = "car";
        } else {
          type = walkOrCar.replace("/", "");
        }
        document.getElementById("Route_title").innerHTML =
          maxOrMin.toUpperCase() + " route by " + type.toUpperCase() + ".";
        document.getElementById("table_distance").innerHTML =
          Math.round(data.distance).toString() + " meter(s)";
        document.getElementById("table_elevation").innerHTML =
          Math.round(data.elevationGain).toString() + " meter(s)";

        //calculate the percentage distance
        let percentage =
          ((data.distance - data.shortestDistance) / data.shortestDistance) *
          100;
        document.getElementById("table_percentage").innerHTML =
          Math.round(percentage).toString() + " %";
        document.getElementById("table_node").innerHTML =
          (data.path.length + 2).toString() + " stop(s)";
        //////  end of render route table  //////
      }
    } else if (response.status === 400) {
      document.getElementById("pop_up_header").innerText = "Can't find route!";
      document.getElementById("pop_up_content").innerText =
        "Please try another search.";
      document.getElementById("popup_box").style.display = "initial";
      window.setTimeout(popup_timeout, 3000);
    } else console.log("fail in index");
  });
}

function min() {
  type = "min";
  minBt.style.background = "hsl(19, 58%, 62%)";
  minBt.style.color = "black";
  maxBt.style.background = "#262c37";
  maxBt.style.color = "hsl(19, 58%, 62%)";
}
function max() {
  type = "max";
  maxBt.style.background = "hsl(19, 58%, 62%)";
  maxBt.style.color = "black";
  minBt.style.background = "#262c37";
  minBt.style.color = "hsl(19, 58%, 62%)";
}
function walk() {
  walkOrCar = "walk";
  walkBt.style.background = "hsl(19, 58%, 62%)";
  walkBt.style.color = "black";
  carBt.style.background = "#262c37";
  carBt.style.color = "hsl(19, 58%, 62%)";
}
function car() {
  walkOrCar = "";
  carBt.style.background = "hsl(19, 58%, 62%)";
  carBt.style.color = "black";
  walkBt.style.background = "#262c37";
  walkBt.style.color = "hsl(19, 58%, 62%)";
}
document.getElementById("myRange").addEventListener(
  "change",
  function () {
    document.getElementById("sliderValue").textContent =
      document.getElementById("myRange").value + "%";
  },
  false
);

function buildMap() {
  map.remove();
  const southWest = L.latLng(42.373775, -72.541988),
    northEast = L.latLng(42.402095, -72.515408),
    bounds = L.latLngBounds(southWest, northEast);

  map = L.map("map", {
    maxBounds: bounds, // Then add it here..
    maxZoom: 18,
    minZoom: 15,
  }).setView([42.391155, -72.526711], 15);

  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery ???? <a href="https://www.mapbox.com/">Mapbox</a>';

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
    [42.373775, -72.541988],
  ];

  polyline = L.polyline(latlngs, { color: "red" }).addTo(map);

  let words = document
    .getElementById("source")
    .value.replace("LatLng(", "")
    .split(",");
  source_l1 = words[0].replace(/\s/g, "");
  source_l2 = words[1].replace(/\s/g, "").replace(")", "");
  words = document
    .getElementById("destination")
    .value.replace("LatLng(", "")
    .split(",");
  des_l1 = words[0].replace(/\s/g, "");
  des_l2 = words[1].replace(/\s/g, "").replace(")", "");

  //event listener when click the map
  let markerOutset = null;
  let markerDestination = null;

  var violetIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  markerOutset = L.marker([source_l1, source_l2], { icon: violetIcon })
    .addTo(map)
    .bindPopup("outset!")
    .openPopup();

  var redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  markerDestination = L.marker([des_l1, des_l2], { icon: redIcon })
    .addTo(map)
    .bindPopup("Destination!")
    .openPopup();

  var popup = L.popup();
  //source or destination record counter
  var counter = 1;

  //get the OSM ID by lat and lon
  function get_id(lat, lon, point) {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
        lat +
        "&lon=" +
        lon,
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
      document.getElementById("source").value = e.latlng
        .toString()
        .replace("LatLng(", "")
        .replace(")", "");
      counter += 1;

      if (markerOutset !== null) {
        map.removeLayer(markerOutset);
      }
      markerOutset = L.marker([parseFloat(latlng1), parseFloat(latlng2)], {
        icon: violetIcon,
      })
        .addTo(map)
        .bindPopup("outset!")
        .openPopup();

      get_id(latlng1, latlng2, "outset");
    } else {
      document.getElementById("destination").value = e.latlng
        .toString()
        .replace("LatLng(", "")
        .replace(")", "");
      counter -= 1;

      if (markerDestination !== null) {
        map.removeLayer(markerDestination);
      }

      markerDestination = L.marker([parseFloat(latlng1), parseFloat(latlng2)], {
        icon: redIcon,
      })
        .addTo(map)
        .bindPopup("Destination!")
        .openPopup();

      get_id(latlng1, latlng2, "Destination");
    }
  }
  map.on("click", onMapClick);
}

function linkToChen() {
  window.location.href = "https://github.com/Qiming-C/";
}
function linkToLau() {
  window.location.href = "https://github.com/hilshong2580/";
}
function linkToLi() {
  window.location.href = "https://github.com/Jiafeng-Li95/";
}

function popup_timeout() {
  document.getElementById("popup_box").style.display = "none";
}
