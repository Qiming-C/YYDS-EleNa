document.getElementById("max").addEventListener('click', max);
document.getElementById("min").addEventListener('click', min);
document.getElementById("go").addEventListener('click', go);
document.getElementById("go").addEventListener('click', get_id);

function get_id() {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };
  
    fetch(
      "https://nominatim.openstreetmap.org/reverse?lat=42.391155&lon=-72.526711",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        const myArray = result.split(" ");
  
        for (let i in myArray) {
          if (myArray[i].startsWith("osm_id")) {
            const osmId = myArray[i].replace(";", "").split("=");
            console.log(osmId[0] + ": " + osmId[1]);
          }
        }
      })
      .catch((error) => console.log("error", error));
  }

function go() {
    //get latlngs
    let source_l1, source_l2, des_l1, des_l2;

    let words = document.getElementById("source").value.replace("LatLng(", "").split(",");
    source_l1 = words[0].replace(/\s/g, "");
    source_l2 = words[1].replace(/\s/g, "").replace(")", "");
    words = document.getElementById("destination").value.replace("LatLng(", "").split(",");
    des_l1 = words[0].replace(/\s/g, "");
    des_l2 = words[1].replace(/\s/g, "").replace(")", "");
    console.log("Source : " + source_l1 + " " + source_l2 + "\n" + "Destination : " + des_l1 + " " + des_l2);

    //short %
    let sliderValue = document.getElementById("myRange").value;
    console.log(sliderValue);


}
function min() {
    document.getElementById("myRange").value = 100;
    document.getElementById("sliderValue").textContent = document.getElementById("myRange").value + "%";
}
function max() {
    document.getElementById("myRange").value = 200;
    document.getElementById("sliderValue").textContent = document.getElementById("myRange").value + "%";
}
document.getElementById("myRange").addEventListener("change", function () {
    document.getElementById("sliderValue").textContent = document.getElementById("myRange").value + "%";
}, false);
