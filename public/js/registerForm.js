let form = document.querySelector(".register_form");
let inputs = document.querySelectorAll(".register_form input");
let button = document.querySelector(".register_form button");
let hint = document.querySelector(".hint");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Получаем значения полей
    let data = {
        login: inputs[0].value,
        email: inputs[1].value,
        phone: inputs[2].value,
        password: inputs[3].value,
        password2: inputs[4].value,
    }

    // Проверяем поля на правильность
    let isValid = true;
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].style.outline = "none";
        inputs[i].style.border = "none";
    }
    if (data.login.length < 3) {
        inputs[0].style.outline = "1px solid red";
        inputs[0].style.border = "1px solid red";
        isValid = false;
        hint.textContent = "Login must be at least 3 characters long";
    }

    if (data.password.length < 8) {
        inputs[3].style.outline = "1px solid red";
        inputs[3].style.border = "1px solid red";
        isValid = false;
        hint.textContent = "Password must be at least 8 characters long";
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(data.email)) {
        inputs[1].style.outline = "1px solid red";
        inputs[1].style.border = "1px solid red";
        isValid = false;
        hint.textContent = "Invalid email format";
    }

    if (!/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(data.phone)) {
        inputs[2].style.outline = "1px solid red";
        inputs[2].style.border = "1px solid red";
        isValid = false;
        hint.innerHTML = `Invalid phone number format,</br>example: +3 (801) 234-56789`;
    }

    if (data.password !== data.password2) {
        inputs[3].style.outline = "1px solid red";
        inputs[3].style.border = "1px solid red";
        inputs[4].style.outline = "1px solid red";
        inputs[4].style.border = "1px solid red";
        isValid = false;
        hint.textContent = "Passwords do not match";
    }

    if (isValid) {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.outline = "1px solid green";
            inputs[i].style.border = "1px solid green";
        }
    }

    if (!isValid) {
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            if (data.message == "You have already registered with this login, email or phone") {
                hint.textContent = data.message;
                hint.style.color = "red";
            } else {
                hint.textContent = data.message;
                hint.style.color = "green";
                form.reset();
            }
        }).catch((error) => {
            console.error('Error:', error);
            hint.textContent = "Something went wrong";
        });
})

