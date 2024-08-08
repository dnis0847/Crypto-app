
// Получаем поля ввода и кнопку, контейнер для таблицы и сохраняем в переменные
let inputField = document.querySelector(".adrees_container input");
let buttonField = document.querySelector(".adrees_container button");
let mainContainer = document.querySelector(".container_main_info");
let resData = []

// Добавляем обработчик клика на кнопку
buttonField.addEventListener("click", (e) => {
    e.preventDefault(); // Отменяем стандартное поведение кнопки

    let inputValue = inputField.value; // Получаем значение из поля ввода

    if (inputValue == "") { // Проверяем, что значение не пустое
        inputField.value = "Enter your token adress!"; // Устанавливаем сообщение об ошибке
        inputField.style = "color: #FF5733"; // Устанавливаем цвет текста
    } else {
        getData(inputValue); // Вызываем функцию для получения данных
        inputField.value = ""; // Очищаем поле ввода
    }
});

// Функция для получения данных по токену
function getData(inputValue) {
    let data = {
        tokenAdress: inputValue,
    }
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            resData = []
            if (localStorage.getItem('data') == undefined || localStorage.getItem('data') == null) {
                resData.push(data.getdata)
                addToLocalStorage(resData)
            } else {
                resData = JSON.parse(localStorage.getItem('data')) // Получаем данные из локального хранилища
                resData.push(data.getdata)
                addToLocalStorage(resData)
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Функция для добавления данных в локальное хранилище и создания таблицы
function addToLocalStorage(data) {
    localStorage.setItem('data', JSON.stringify(data)); // Сохраняем данные в локальном хранилище
    createTable(); // Создаем таблицу
}

// Функция для создания таблицы
function createTable() {
    mainContainer.innerHTML = ""; // Очищаем контейнер таблицы
    let data = JSON.parse(localStorage.getItem('data')); // Получаем данные из локального хранилища
    for (key in data) {
        if (data[key].volumeInTones == 0) {
            mainContainer.innerHTML += `
            <div class="main_body" id="${key}">
                <div class="table_cell">
                    ${data[key].name}
                </div>
                <div class="table_cell">
                    <img class="image" src="${data[key].img}" alt="Token image">
                </div>
                <div class="table_cell">
                    ${data[key].date}
                </div>
                <div class="table_cell">
                    ${(data[key].tonPrice).toFixed(2)} $
                </div>
                <div class="table_cell">
                    ${(data[key].usdPrice).toFixed(2)} $
                </div>
                <div class="table_cell">
                    <input type="number" class="tonVolume" placeholder="Enter value">
                    <img class="calc" src="./images/calc.svg" alt="calculation">
                </div>
                <div class="table_cell">
                    ${(data[key].amountInUSD).toFixed(2)} $
                </div>
                <div class="table_cell">
                    ${(data[key].purchasePrice).toFixed(2) + " " + data[key].name}
                </div>
                <div class="table_cell">
                    <img class="delToken" src="./images/trash.svg"  alt="DeleteToken">
                </div>
            </div>
        `;
        } else {
            mainContainer.innerHTML += `
            <div class="main_body" id="${key}">
                <div class="table_cell">
                    ${data[key].name}
                </div>
                <div class="table_cell">
                    <img class="image" src="${data[key].img}" alt="Token image">
                </div>
                <div class="table_cell">
                    ${data[key].date}
                </div>
                <div class="table_cell">
                    ${(data[key].tonPrice).toFixed(2)} $
                </div>
                <div class="table_cell">
                    ${(data[key].usdPrice).toFixed(2)} $
                </div>
                <div class="table_cell">
                    ${data[key].volumeInTones} TONS
                    <img class="enter" src="./images/calc.svg" alt="calculation">
                </div>
                <div class="table_cell">
                    ${(data[key].amountInUSD).toFixed(2)} $
                </div>
                <div class="table_cell">
                    ${(data[key].purchasePrice).toFixed(2) + " " + data[key].name} 
                </div>
                <div class="table_cell">
                    <img class="delToken" src="./images/trash.svg"  alt="DeleteToken">
                </div>
            </div>
        `;
        }
    }
    if (localStorage.getItem("data") != null && localStorage.getItem("data") != undefined && localStorage.getItem("data") != "[]") {
        mainContainer.innerHTML += `
        <div class="sendMessageBlock" >
            <button class="sendMessage">
                Send message in Data Base and Telegram
            </button>
        </div>
        `;
    } else {
        mainContainer.innerHTML = "<h2>There is no data</h2>";
    }
}


