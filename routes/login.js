const { Router } = require("express");
const router = Router();
const connect = require("../moduls/connectBase");
const sesion = require("express-session");

// маршрут для страницы авторизации
router.get("/", (req, res) => {
    res.render("login", {
        layout: "loginLayout",
        title: "Авторизация",
    });
});

router.post("/", (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    checkUser(login, password)
        .then((result) => {
            if (result.length > 0) {
                req.session.user = result[0].login;
                req.session.admin = result[0].admin;
                res.send({
                    message: "Login success",
                    login: result[0].login
                });
            } else {
                res.send({
                    message: "Incorrect login or password",
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

function checkUser(login, password) {
    return new Promise((resolve, reject) => {
        const db = connect;
        const sql = "SELECT * FROM users WHERE login = ? AND password = ?";
        const values = [login, password];
        db.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


// экспортируем маршрут
module.exports = router;

