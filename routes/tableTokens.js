const bodyParser = require("body-parser");
const { json } = require("express");
const { Router } = require("express");
const router = Router();
const connect = require("../moduls/connectBase");
const moment = require("moment");
const session = require("express-session");

router.get("/", async (req, res) => {
    const login = req.session.user;
    const admin = req.session.admin;
    if (admin) {
        res.render("tableTokens", {
            layout: "tableTokensLayout",
            title: "Админ панель",
            login: login,
            admin: admin
        });
    } else {
        res.redirect("/");
    }
});

router.post("/", async (req, res) => {
    let date = req.body;
    const connection = await connect.promise();
    // Извлекаем только дату из данной даты
    const onlyDate = moment(date.date).format("YYYY-MM-DD");
    const query = 'SELECT * FROM tokens WHERE date >= ? AND date < ?';
    // Добавляем к начальной дате время 00:00:00
    const startDate = moment(onlyDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    // Добавляем к конечной дате время 23:59:59
    const endDate = moment(onlyDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    const values = [startDate, endDate];
    const [data] = await connection.query(query, values);
    const newData = data.map((item) => {
        // Форматируем дату в нужный формат
        return {
            ...item,
            date: moment(item.date).format("DD.MM.YYYY HH:mm:ss"),
        };
    })
    res.send({
        title: "Админ панель",
        getdata: newData
    });
});

module.exports = router