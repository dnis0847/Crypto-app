mainContainer.addEventListener("click", (e) => {
    e.preventDefault();
    let target = e.target;
    if (target.className == "sendMessage") {
        let data = JSON.parse(localStorage.getItem('data'));
        let login = JSON.parse(localStorage.getItem('login'));// 
        const isFieldEmpty = data.some(item => item.volumeInTones == 0);
        if (isFieldEmpty) {
            return alert("Fill all fields");
        }
        if (login) {
            data.forEach(item => {
                item.login = login;
            });
        } else {
            return alert("You need to be logged in");
        }
        fetch('/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).then(data => {
            if (data.getdata == "Message sent") { 
                localStorage.setItem('data', JSON.stringify([]));
                createTable();
                if (localStorage.getItem("data") == "[]") {
                    mainContainer.innerHTML = `
                        <h2>Thank you. Data sent!</h2>
                    `;
                }
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }
})

