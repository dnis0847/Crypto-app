document.addEventListener("DOMContentLoaded", function () {
  setInterval(() => {
    fetch("./portfolio/updateValues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: "Update",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        updateCurrentUSDPrice(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, 5000);
});

/**
 * Обновляет текущую цену USD в таблице
 * @param {Object} data - Объект с данными для обновления
 */
function updateCurrentUSDPrice(data) {
  // Проверяем, что данные были успешно обновлены
  if (data.message === "Data updated") {
    // Получаем все строки таблицы
    const rows = tbody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      // Проверяем, что у строки есть ячейки с ценой
      if (cells.length > 3) { 
        let color;
        let price_usd_current = data.portfolioData[i].price_usd_current;
        let price_usd_start = data.portfolioData[i].price_usd_start;
        const priceCell = cells[3]; 
        const address = data.portfolioData[i].address;
        // Вычисляем процентные изменения
        let percents;
        percents = ((price_usd_current - price_usd_start) / price_usd_start * 100).toFixed(2);
        if (percents > 0) {
          color = 'green';
        } else if (percents < 0) {
          color = 'red';
        } else {
          color = 'black';
        }
        // Устанавливаем содержимое ячейки с ценой
        priceCell.innerHTML = `<a target="_blank" href="https://www.geckoterminal.com/ru/ton/pools/${address}">${price_usd_current} $  &nbsp;&nbsp;|&nbsp;&nbsp; <span style="color: ${color}">${percents}%</span></a>`;
      }
    }
  }
}

