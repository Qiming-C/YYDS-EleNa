document.getElementById("max").addEventListener("click", max);
document.getElementById("min").addEventListener("click", min);
document.getElementById("go").addEventListener("click", go);

let type = null;

function go() {
  //get latlngs
  let source_l1, source_l2, des_l1, des_l2;

  //get OSM id
  const storage = window.localStorage;
  let outset = storage.getItem("outset");
  let Destination = storage.getItem("Destination");

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
  console.log(
    "Source : " +
      source_l1 +
      " " +
      source_l2 +
      "\n" +
      "Destination : " +
      des_l1 +
      " " +
      des_l2
  );

  //short %
  let sliderValue = document.getElementById("myRange").value;
  console.log(sliderValue);
  console.log(type+"   go");

/**
    const raw = JSON.stringify({
        "start": {
            "coordinates": [
                source_l1,
                source_l2
            ],
            "osmId": outset
        },
        "end": {
            "coordinates": [
                des_l1,
                des_l2
            ],
        "osmId": Destination
        }, 
        "percentage":sliderValue,
        "type": type
});

   const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: raw,
  };

  fetch("http://localhost:8080/wordScore", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

 */
}
function min() {
  type = "min";
  console.log(type+"   min");
}
function max() {
  type = "max";
  console.log(type +"   max");
}
document.getElementById("myRange").addEventListener(
  "change",
  function () {
    document.getElementById("sliderValue").textContent =
      document.getElementById("myRange").value + "%";
  },
  false
);
