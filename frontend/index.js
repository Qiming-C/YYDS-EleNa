document.getElementById("myRange").addEventListener("change", function() {
    document.getElementById("sliderValue").textContent = document.getElementById("myRange").value +"%";
}, false);