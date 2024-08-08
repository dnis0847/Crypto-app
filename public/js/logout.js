document.addEventListener("DOMContentLoaded", function () {
    let exit = document.querySelector(".exit");
    if (exit != null) {
        exit.addEventListener("click", (e) => {
            e.preventDefault();
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(data => {
                    if (data.getdata == "logout") {
                        localStorage.removeItem('login');
                        location.reload();
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        })
    }
})