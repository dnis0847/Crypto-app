document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("data") != null && localStorage.getItem("data") != undefined && localStorage.getItem("data") != "[]") {
        createTable();
    } else {
        mainContainer.innerHTML = "<h2>There is no data</h2>";
    }
})