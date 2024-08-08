const bodyParser = require("body-parser");
const { json } = require("express");
const { Router } = require("express");
const router = Router();
const connect = require("../moduls/connectBase");
const moment = require("moment");
const session = require("express-session");
const axios = require("axios");

router.get("/", async (req, res) => {
  const login = req.session.user;
  const admin = req.session.admin;
  const tableName = login + "_portfolio";

  // Проверяем наличие таблицы в базе данных
  const checkTableQuery = `SHOW TABLES LIKE '${tableName}'`;
  const checkTableResult = await connect.promise().query(checkTableQuery)
  const columns = [
    "id",
    "name",
    "img",
    "date",
    "address",
    "price_usd_start",
    "price_usd_current",
  ];

  if (checkTableResult[0].length === 0) {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns
      .map((column) => `${column} VARCHAR(255)`)
      .join(", ")})`;
    await connect.promise().query(createTableQuery);
  }
  if (admin ) {
    // Проверяем наличие данных в таблице
    const checkDataQuery = `SELECT * FROM ${tableName}`;
    const checkDataResult = await connect.promise().query(checkDataQuery);
    if (checkDataResult[0].length === 0) {
      res.render("portfolio", {
        layout: "portfolioLayout",
        title: "Портфолио",
        login: login,
        admin: admin,
        message: "Таблица портфолио пустая",
      });
    } else if (checkDataResult[0].length > 0) {
    res.render("portfolio", {
      layout: "portfolioLayout",
      title: "Портфолио",
      login: login,
      admin: admin,
      portfolio: checkDataResult[0],
    });
    return;
    }} else {
    res.redirect("/");
  }
});

router.post("/", async (req, res) => {
  try {
    const login = req.session.user;
    const admin = req.session.admin;
    const token_adress = req.body.portfolio;
    const tableName = `${login}_portfolio`;

    const checkTableQuery = `SHOW TABLES LIKE '${tableName}'`;
    const checkTableResult = await connect.promise().query(checkTableQuery);

    if (checkTableResult[0].length !== 0) {
      const checkTokenQuery = `SELECT * FROM ${tableName} WHERE address = ?`;
      const checkTokenResult = await connect
        .promise()
        .query(checkTokenQuery, [token_adress]);

      if (checkTokenResult[0].length > 0) {
        return res.send({
          title: "Портфолио",
          message: "Токен уже добавлен",
        });
      }
    }

    const token = await axios.get(
      `https://api.geckoterminal.com/api/v2/networks/ton/tokens/multi/${token_adress}`
    );
    const tokenData = token.data.data[0].attributes;

    const columns = [
      "id",
      "name",
      "img",
      "date",
      "address",
      "price_usd_start",
      "price_usd_current",
    ];
    const values = [
      Date.now(),
      tokenData.symbol,
      tokenData.image_url,
      moment(tokenData.updated_at).format("YYYY-MM-DD HH:mm:ss"),
      tokenData.address,
      tokenData.price_usd,
      tokenData.price_usd,
    ];

    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns
      .map((column) => `${column} VARCHAR(255)`)
      .join(", ")})`;
    const insertQuery = `INSERT INTO ${tableName} (${columns.join(
      ", "
    )}) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    await Promise.all([
      connect.promise().query(createTableQuery),
      connect.promise().query(insertQuery, values),
    ]);

    const portfolioData = await connect
      .promise()
      .query(`SELECT * FROM ${tableName}`);

    res.send({
      title: "Портфолио",
      login: login,
      admin: admin,
      portfolioData: portfolioData[0],
      message: "Токен добавлен в портфолио",
    });
  } catch (error) {
    console.error("Ошибка:", error);
    res.status(500).send({
      title: "Портфолио",
      error: "Ошибка при получении данных о токене",
    });
  }
});

router.post("/updateValues", async (req, res) => {
  if (req.body.data == "Update") {
    try {
      const login = req.session.user;
      const admin = req.session.admin;
      const tableName = `${login}_portfolio`;
      const portfolioData = await connect
        .promise()
        .query(`SELECT * FROM ${tableName}`);
      res.send({
        title: "Портфолио",
        login: login,
        admin: admin,
        portfolioData: portfolioData[0],
        message: "Data updated",
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({
        title: "Портфолио",
        error: "Error",
      });
    }
  }
});

router.put("/", async (req, res) => {
    let editToken = req.body.idToken;
    let volume = req.body.volume;
    try {
        const login = req.session.user;
        const admin = req.session.admin;
        const tableName = `${login}_portfolio`;
        const updateQuery = `UPDATE ${tableName} SET price_usd_start = ? WHERE id = ?`;
        await connect.promise().query(updateQuery, [volume, editToken]);
        res.send({
            title: "Портфолио",
            login: login,
            admin: admin,
            message: "Token updated",
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            title: "Портфолио",
            error: "Error",
        });
    }
})

router.delete("/", async (req, res) => {
    let deleteToken = req.body.idToken;
    try {
        const login = req.session.user;
        const admin = req.session.admin;
        const tableName = `${login}_portfolio`;
        const deleteQuery = `DELETE FROM ${tableName} WHERE id = ?`;
        await connect.promise().query(deleteQuery, [deleteToken]);
        res.send({
            title: "Портфолио",
            login: login,
            admin: admin,
            message: "Token deleted",
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            title: "Портфолио",
            error: "Error",
        });
    }
}); 

module.exports = router;
