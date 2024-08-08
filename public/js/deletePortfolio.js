tbody.addEventListener("click", (e) => {
  if (e.target.getAttribute("data-atribute") == "delete") {
    let id = e.target.parentElement.parentElement.id;
    e.target.parentElement.parentElement.classList.add("fadeOut");
    e.target.parentElement.parentElement.style = "display: none";
    fetch(`/portfolio`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message == "Portfolio deleted") {
          alert(data.message);
          window.location.href = "/portfolio";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
