const cron = require('node-cron');
const connect = require('./connectBase');
const TelegramBot = require('node-telegram-bot-api');

const botToken = 'TG_BOT_TOKEN';
const bot = new TelegramBot(botToken, { polling: true, single_session: true });

let sendMessageonTelegram = async () => {
  const [tables] = await connect.promise().query('SHOW TABLES LIKE "%_portfolio"');
  const tablesNames = tables.map(table => table[Object.keys(table)[0]]);

  for (const tableName of tablesNames) {
    const sql = `SELECT address, name, price_usd_start, price_usd_current FROM ${tableName}`;
    const [tokens] = await connect.promise().query(sql);
    let login = tableName.split('_')[0];

    const messages = {};
    for (const token of tokens) {
      const [result] = await connect.promise().query(
        `SELECT price_usd_start, price_usd_current FROM ${tableName} WHERE address = ?`,
        [token.address]
      );
      const priceStart = result[0].price_usd_start;
      const priceCurrent = result[0].price_usd_current;
      const percents = ((priceCurrent - priceStart) / priceStart * 100).toFixed(2);

      const [users] = await connect.promise().query(`SELECT chat_id FROM users WHERE login = ?`, [login]);
      if (users.length > 0) {
        for (const user of users) {
          const chat_id = user.chat_id;
          const message = `Цена ${token.name} изменилась на ${percents}%`;
          if (!messages[chat_id]) {
            messages[chat_id] = message;
          } else {
            messages[chat_id] += '\n' + message;
          }
        }
      }
    }

    Object.entries(messages).forEach(([chat_id, message]) => {
      bot.sendMessage("-" + chat_id, message);
    });
  }
}

cron.schedule('0 * * * *', sendMessageonTelegram); // каждый час
// cron.schedule('*/5 * * * * *', sendMessageonTelegram); // тест каждые 5 сек


module.exports = sendMessageonTelegram;

