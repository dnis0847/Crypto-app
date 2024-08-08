const cron = require('node-cron');
const connect = require('./connectBase');
const axios = require('axios');


// Функция для обновления данных в базе данных
const updateDB = async () => {
    // Получаем список таблиц
    const [tables] = await connect.promise().query('SHOW TABLES LIKE "%_portfolio"');
    const tablesNames = tables.map(table => table[Object.keys(table)[0]]);

    // Получаем список уникальных адресов токенов
    const tokens = await Promise.all(tablesNames.map(async (tablesName) => {
        const [token] = await connect.promise().query(`SELECT address FROM ${tablesName}`);
        return token.map(token => token.address)
    }));
    const allTokens = [].concat(...tokens);
    const uniqueTokens = [...new Set(allTokens)];

    // Получаем данные о токенах с Gecko API
    const geckoTokens = await axios.get(`https://api.geckoterminal.com/api/v2/networks/ton/tokens/multi/${uniqueTokens}`);

    // Обновляем данные в базе данных
    const tokensObj = geckoTokens.data.data.map((token) => {
        return {
            address: token.attributes.address,
            usdPrice: token.attributes.price_usd,
            name: token.attributes.symbol
        }
    });
    for (let i = 0; i < tokensObj.length; i++) {
        tablesNames.forEach(async (table) => {
            const sql = `UPDATE ${table} SET price_usd_current = ? WHERE address = ?`;
            const values = [tokensObj[i].usdPrice, tokensObj[i].address];
            await connect.promise().query(sql, values);
        });
    }
}

// Функция для отправки уведомления в Telegram

const task = cron.schedule('*/5 * * * * *', updateDB); 

module.exports = task