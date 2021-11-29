document.getElementById("max").addEventListener("click", max);
document.getElementById("min").addEventListener("click", min);
document.getElementById("go").addEventListener("click", go);

let type = null;
let minBt = document.getElementById("min");
let maxBt = document.getElementById("max");
const storage = window.localStorage;
let polyline = 1;

function go() {
  if (
    document.getElementById("source").value === "" ||
    document.getElementById("destination").value === "" ||
    type === null
  ) {
    alert("No source or destination or min or max");
  } else {
    //get latlngs
    let source_l1, source_l2, des_l1, des_l2;

    //get OSM id
    const storage = window.localStorage;
    let outset = storage.getItem("outset");
    let destination = storage.getItem("Destination");

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

    //short 
    let sliderValue = document.getElementById("myRange").value;
    sliderValue = (sliderValue - 100) / 100;

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
    postData(raw, type);
  }
}

async function postData(JSONData, maxOrMin) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(JSONData),
  };

  fetch("http://localhost:3000/api/map/" + maxOrMin, requestOptions).then(
    async (response) => {
      if (response.status === 200) {
        const data = (await response.json());
        let latlngs = [
          [JSONData.start.coordinates[1], JSONData.start.coordinates[0]]
        ];
        for (let i = 0; i < data.path.length; i++) {
          latlngs.push([data.path[i].data.coordinates[0], data.path[i].data.coordinates[1]]);
        }
        latlngs.push([JSONData.end.coordinates[1], JSONData.end.coordinates[0]]);

        polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);
      }
      else console.log("fail in index");
    }
  );
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
document.getElementById("myRange").addEventListener(
  "change",
  function () {
    document.getElementById("sliderValue").textContent =
      document.getElementById("myRange").value + "%";
  },
  false
);
