document.addEventListener("DOMContentLoaded", function () {
  let today = new Date();
  date.valueAsDate = today;
  let newDate = date.value;
  postDateAndGetData(newDate)
});

date.addEventListener("change", function () {
  let newDate = date.value;
  postDateAndGetData(newDate)
});

/**
 * Sends the selected date to the server and displays the data in the table
 * @param {string} newDate - The date to send to the server
 */
function postDateAndGetData(newDate) {
  if (newDate) {
    // Send the date to the server
    fetch("/tableTokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: newDate,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          let container_main_info = document.querySelector(".container_main_info");
          if (data.getdata) {
            container_main_info.innerHTML = "";
            let loginData = {};
            // Group the data by login
            for (let i = 0; i < data.getdata.length; i++) {
              if (!loginData[data.getdata[i].login]) {
                loginData[data.getdata[i].login] = [];
              }
              loginData[data.getdata[i].login].push(data.getdata[i]);
            }
            // Display the data in the table
            for (let login in loginData) {
              container_main_info.innerHTML += `
                <h3 class="login_table">${login}</h3>
                <table class="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">TonPrice</th>
                    <th scope="col">UsdPrice</th>
                    <th scope="col">VolumeInTones</th>
                    <th scope="col">AmountInUSD</th>
                    <th scope="col">PurchasePrice</th>
                  </tr>
                </thead>
                <tbody>
                ${loginData[login].map((item) => `
                  <tr>
                    <td class="name-table">${item.name} <img class="image-table" src="${item.img}"></td>
                    <td>${item.date}</td>
                    <td>${item.tonPrice} $</td>
                    <td>${item.usdPrice} $</td>
                    <td>${item.volumeInTones} TON</td>
                    <td>${item.amountInUSD} $</td>
                    <td>${item.purchasePrice} ${item.name}</td>
                  </tr>
                `).join('')}
                </tbody>
              </table>
              `;
            }
          } else {
            // No data to display
            container_main_info.innerHTML += "<h2>There is no data</h2>";
          }
        })
        .catch((error) => {
          // Log any errors
          console.error("Error:", error);
        });
  }
}