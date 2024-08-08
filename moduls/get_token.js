const axios = require("axios");
let getToken;
let coinObJ = {}
let my_id = 0;

formattedDateTimefunc = () => {
  let now = new Date()
  let year = now.getFullYear();
  let month = (now.getMonth() + 1).toString().padStart(2, "0"); // Добавляем ведущий ноль при необходимости
  let day = now.getDate().toString().padStart(2, "0"); // Добавляем ведущий ноль при необходимости
  let hours = now.getHours().toString().padStart(2, "0"); // Добавляем ведущий ноль при необходимости
  let minutes = now.getMinutes().toString().padStart(2, "0"); // Добавляем ведущий ноль при необходимости
  let seconds = now.getSeconds().toString().padStart(2, "0"); // Добавляем ведущий ноль при необходимости

  // Формируем итоговую строку с датой и временем
  return (formattedDateTime = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`);
};

getToken = async (address) => {
  if(address == ''){
    return
  } else {
    const tonPrice = async () => {
      const apiTon =
        "https://api.geckoterminal.com/api/v2/networks/ton/tokens/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";
  
      try {
        const response = await axios.get(apiTon);
        coinObJ.tonPrice = Number(response.data.data.attributes.price_usd);
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
      }
    };
  
    await tonPrice();
  
    const apiGecko =
      "https://api.geckoterminal.com/api/v2/networks/ton/tokens/" + address;
    try {
      const response = await axios.get(apiGecko);
      coinObJ.id = my_id++;
      coinObJ.name = response.data.data.attributes.symbol;
      coinObJ.img = response.data.data.attributes.image_url;
      coinObJ.date = formattedDateTimefunc();
      coinObJ.usdPrice = Number(response.data.data.attributes.price_usd);
      coinObJ.volumeInTones = 0;
      coinObJ.amountInUSD = 0;
      coinObJ.purchasePrice = 0;
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  }
  return coinObJ;
};

module.exports = {
  getToken: getToken,
  data: coinObJ,
};

