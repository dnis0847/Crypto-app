let createNewUser_block = document.querySelector(".createNewUser_block")
let login = document.querySelector(".createNewUser_block input[name='login']")
let email = document.querySelector(".createNewUser_block input[name='email']")
let phone = document.querySelector(".createNewUser_block input[name='phone']")
let chat_id = document.querySelector(".createNewUser_block input[name='chat_id']")
let password = document.querySelector(".createNewUser_block input[name='password']")
let admin = document.querySelector(".createNewUser_block input[name='admin']")
let button = document.querySelector(".createNewUser_block button")

button.addEventListener("click", (e) => {
    e.preventDefault()
    let data = {
        login: login.value,
        email: email.value,
        phone: phone.value,
        chat_id: chat_id.value,
        password: password.value,
        admin: admin.checked
    }
    fetch(`/editUser/${login.value}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            if (data.message == "User updated") {
                alert(data.message)
                window.location.href = "/tableUsers";
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
})