const loginContainer = document.querySelector(".login_form");

loginContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    let login = document.querySelector(".login_form input[name='login']");
    let password = document.querySelector(".login_form input[name='password']");
    let button = document.querySelector(".login_form button");
    let hint = document.querySelector(".login_form .hint");
    if (e.target.className == "login_form") {
        if (login.value == "" || password.value == "") {
            hint.style = "color: #FF5733";
            hint.textContent = "Enter your login and password!";
            return;
        }
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: login.value, password: password.value })  
        }).then(response => response.json())
            .then(data => {
                if (data.message == "Wrong login or password") {
                    hint.style = "color: red";
                    hint.textContent = data.message;
                } else {
                    hint.style = "color: green";
                    hint.textContent = data.message;
                    loginContainer.reset();
                    localStorage.setItem('login', JSON.stringify(data.login));
                    if (data.admin == 1) {
                        localStorage.setItem('admin', JSON.stringify(data.admin));
                    }
                    window.location.href = "/";
                }
            }).catch((error) => {
                console.error('Error:', error);
            });
    }
})