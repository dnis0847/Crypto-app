const input = document.querySelector(".adrees_container input");
const button = document.querySelector(".adrees_container button");
const mainContainer = document.querySelector(".container_main_info");
const alert_box = document.querySelector(".alert_box");
const tbody = document.querySelector(".table tbody");

button.addEventListener("click", (e) => {
  e.preventDefault();
  let inputValue = input.value;
  if (inputValue == "") {
    input.value = "Enter your token adress!";
    input.style = "color: #FF5733";
  } else {
    fetch(`/portfolio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ portfolio: inputValue }),
    }).then((response) => response.json())
      .then((data) => {
        getData(data) 
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
    input.value = "";
})

function getData(data) {
  if (data.portfolioData && data.message) {
    alert_box.innerHTML = data.message;
    tbody.innerHTML = '';
    for (key in data.portfolioData) {
      tbody.innerHTML += `
        <tr>
          <td class="name-table">${data.portfolioData[key].name} <img src="${data.portfolioData[key].img}"></td>
          <td>${data.portfolioData[key].date}</td>
          <td>${data.portfolioData[key].price_usd_start} $ | <a href="#">Edit</a></td>
          <td class="name-table price-table"><a href="https://www.geckoterminal.com/ru/ton/pools/${data.portfolioData[key].address}">${data.portfolioData[key].price_usd_current} $ </a></td>
          <td><a>Delete</a></td>
        </tr>
      `;
    }
  } else if (data.message) {
    alert_box.innerHTML = data.message;
  } else {
    alert_box.innerHTML = data.error;
    alert_box.style = "color: #FF5733";
  }
}