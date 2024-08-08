mainContainer.addEventListener("click", (e) => {
    e.preventDefault();
    let target = e.target;
    if (target.className == "calc") {
        if (target.previousElementSibling.value == "") {
            target.previousElementSibling.value = 0;
            target.previousElementSibling.style.color = "#FF5733";
            return;
        }
        else if (parseFloat(target.previousElementSibling.value) <= 0) {
            target.previousElementSibling.value = "";
            target.previousElementSibling.style.color = "#FF5733";
            return;
        }
        else {
            target.previousElementSibling.style.color = "#1C1C1C";
            let id = target.parentElement.parentElement.id;
            let volumeInTones = parseFloat(target.parentElement.children[0].value);
            let data = JSON.parse(localStorage.getItem('data'));
            data[id].volumeInTones = volumeInTones;
            data[id].amountInUSD = volumeInTones * data[id].tonPrice;
            data[id].purchasePrice = data[id].amountInUSD / data[id].usdPrice;
            // localStorage.setItem('data', JSON.stringify(data));
            // createTable();
            fetch('/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(response => response.json())
                .then(data => {
                    localStorage.setItem('data', JSON.stringify(data.getdata));
                    createTable();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    } else if (target.className == "enter") {
        let id = target.parentElement.parentElement.id;
        let data = JSON.parse(localStorage.getItem('data'));
        data[id].volumeInTones = 0;
        data[id].amountInUSD = 0;
        data[id].purchasePrice = 0;
        localStorage.setItem('data', JSON.stringify(data));
        createTable(); 
    }
});

