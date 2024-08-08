const bodyParser = require("body-parser");
const { json } = require("express");
const { Router } = require("express");
const router = Router();
const get_token = require("../moduls/get_token");
const connect = require("../moduls/connectBase");
const moment = require("moment");
const session = require("express-session");
let dataArray;

router.get("/", async (req, res) => {
  const login = req.session.user;
  const admin = req.session.admin;
  res.render("index", {
    title: "Главная страница",
    login: login,
    admin: admin
  });
});

router.post("/", async (req, res) => {
  const { tokenAdress } = req.body;
  dataArray = await get_token.getToken(tokenAdress);
  res.send({
    title: "Главная страница",
    getdata: dataArray,
  });
  req.on("data", (data) => {
    dataArray = JSON.parse(data);
  });
});

router.post("/update", async (req, res) => {
  const data = req.body;
  dataArray = data
  res.send({
    title: "Главная страница",
    getdata: dataArray,
  });
  req.on("data", (data) => {
    dataArray = JSON.parse(data);
  });
});

router.post("/delete", async (req, res) => {
  const data = req.body;
  delete dataArray[data.id];
  res.send("index", {
    title: "Главная страница",
    getdata: dataArray,
  });
  req.on("data", (data) => {
    dataArray = JSON.parse(data);
  });
});

router.post("/sendMessage", async (req, res) => {
  const dataArr = req.body;
  try {
    const connection = await connect.promise();
    for (const data of dataArr) {
      const newDate = moment(data.date, 'DD.MM.YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      data.date = newDate;
      const query = 'INSERT INTO tokens (name, img, date, tonPrice, usdPrice, volumeInTones, amountInUSD, purchasePrice, login) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [data.name, data.img, new Date(data.date), data.tonPrice, data.usdPrice, data.volumeInTones, data.amountInUSD, data.purchasePrice, data.login];
      await connection.query(query, values);
    }
    res.send({
      title: "Главная страница",
      getdata: "Message sent"
    });
  } catch (error) {
    console.error('Error:', error);
    res.send({
      title: "Главная страница",
      getdata: "Error"
    });
  }
});

router.post("/logout", async (req, res) => {
  req.session.destroy();
  res.send({
    getdata: "logout"
  });
});


module.exports = router;
