let createUserForm = document.getElementById("createNewUser_form")
let createUserFormButton = document.querySelector("#createNewUser_form button")

createUserFormButton.addEventListener("click", (e) => {
    e.preventDefault()
    let login = document.querySelector("#createNewUser_form input[name='login']")
    let email = document.querySelector("#createNewUser_form input[name='email']")
    let phone = document.querySelector("#createNewUser_form input[name='phone']")
    let chat_id = document.querySelector("#createNewUser_form input[name='chat_id']")
    let password = document.querySelector("#createNewUser_form input[name='password']")
    let admin = document.querySelector("#createNewUser_form input[name='admin']")

    let data = {
        login: login.value,
        email: email.value,
        phone: phone.value,
        chat_id: chat_id.value,
        password: password.value,
        admin: admin.checked
    }

    fetch('/tableUsers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            if (data.message == "User created") {
                alert(data.message)
                window.location.href = "/tableUsers";
            } else {
                alert(data.message)
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
})