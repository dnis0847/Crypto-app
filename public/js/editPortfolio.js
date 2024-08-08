tbody.addEventListener("click", (e) => {
    if (e.target.getAttribute("data-atribute") == "edit") {
         let idToken = e.target.parentElement.parentElement.getAttribute("id");
         let tokenValue = e.target.parentElement.innerHTML = `<input type="number" class="tonVolume name="volume" id="volume" value="${e.target.parentElement.children[0].textContent}"> <button data-atribute="save" class="saveToken">Save</button>`;
         let saveToken = document.querySelector(".saveToken");
         saveToken.addEventListener("click", (e) => {
            let volume = document.getElementById("volume").value;
            console.log(volume);
            tokenValue = e.target.parentElement.innerHTML = `<span>${volume} $ </span> <button data-atribute="edit" class="editToken">Edit</button>`;
            fetch(`/portfolio`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken, volume }),
            }).then(response => response.json())
                .then(data => {
                    if (data.message == "Token updated") {
                        window.location.href = "/portfolio";
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
    })
    }
})