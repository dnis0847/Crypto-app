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
    try {
        const [users] = await connect.promise().query('SELECT * FROM `users`');
        if (admin) {
            res.render("tableUsers", {
                layout: "tableUsersLayout",
                title: "Таблица пользователей",
                login: login,
                admin: admin,
                users: users
            });
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.error('Error:', error);
        res.send('Error');
    }
});

router.post("/", async (req, res) => {
    const data = req.body;
    try {
        const connection = await connect.promise();
        const query = 'SELECT * FROM users WHERE login = ? OR email = ? OR phone = ?'; // тут производится поиск по логину, почте и телефону 
        const values = [data.login, data.email, data.phone];
        const [dataArr] = await connection.query(query, values); // тут производится поиск по логину, почте и телефону
        if (dataArr.length > 0) {
            res.send({
                title: "Таблица пользователей",
                getdata: "Пользователь с такими данными уже существует"
            })
            return } else {
            const query2 = 'INSERT INTO users (login, email, phone, chat_id, password, admin) VALUES (?, ?, ?, ?, ?, ?)';
            const values2 = [data.login, data.email, data.phone, data.chat_id, data.password, data.admin];
            await connection.query(query2, values2);
            res.send({
                title: "Таблица пользователей",
                message: "User created",
            })
        }
    } catch (error) {
        console.error('Error:', error);
        res.send({
            title: "Таблица пользователей",
            getdata: "Error"
        });
    }
});

router.delete("/:loginUser", async (req, res) => {
    const loginUser = req.params.loginUser;
    try {
        const connection = await connect.promise();
        const query = 'DELETE FROM users WHERE login = ?';
        const values = [loginUser];
        await connection.query(query, values);
        res.send({
            title: "Таблица пользователей",
            message: "User deleted",
        })
    } catch (error) {
        console.error('Error:', error);
        res.send({
            title: "Таблица пользователей",
            getdata: "Error"
        });
    }
});

module.exports = router;