document.getElementById("max").addEventListener('click', max);
document.getElementById("min").addEventListener('click', min);
document.getElementById("go").addEventListener('click', go);

function go() {
    alert("Go!");
}
function min() {
    alert("min");
}
function max() {
    alert("Max");
}
document.getElementById("myRange").addEventListener("change", function () {
    document.getElementById("sliderValue").textContent = document.getElementById("myRange").value + "%";
}, false);
