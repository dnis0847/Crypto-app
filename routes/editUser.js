const bodyParser = require("body-parser");
const { json } = require("express");
const { Router } = require("express");
const router = Router();
const connect = require("../moduls/connectBase");
const moment = require("moment");
const session = require("express-session");

router.get("/:loginUser", async (req, res) => {
    const loginUser = req.params.loginUser;
    const login = req.session.user;
    const admin = req.session.admin;
    try {
        const [users] = await connect.promise().query('SELECT * FROM `users` WHERE login = ?', loginUser);
        if (admin) {
            res.render("editUser", {
                layout: "editUserLayout",
                title: "Редактирование пользователя",
                login: login,
                admin: admin,
                users: users,
                loginUser: loginUser
            });
        } else {
            res.redirect("/");
        } 
    } catch (error) {
        console.error('Error:', error);
        res.send('Error');
    }
});

router.post("/:loginUser", async (req, res) => {
    const loginUser = req.params.loginUser;
    const data = req.body;
    try {
        const connection = await connect.promise();
        const query = 'UPDATE users SET login = ?, email = ?, phone = ?, chat_id = ? ,password = ?, admin = ? WHERE login = ?';
        const values = [data.login, data.email, data.phone, data.chat_id, data.password, data.admin, loginUser];
        await connection.query(query, values);
        res.send({
            title: "Редактирование пользователя",
            message: "User updated",
        })
    } catch (error) {
        console.error('Error:', error);
        res.send({
            title: "Редактирование пользователя",
            getdata: "Error"
        });
    }
});

module.exports = router