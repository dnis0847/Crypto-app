document.addEventListener("DOMContentLoaded", function () {
  let links = document.querySelectorAll(".deleteUser");
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", (e) => {
      e.preventDefault();
      let login = links[i].getAttribute("data-login");
      let myconfirm = confirm("Are you sure you want to delete this user?");
      if (myconfirm) {
        fetch(`/tableUsers/${login}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message == "User deleted") {
              location.reload();
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        return;
      }
    });
  }
});
