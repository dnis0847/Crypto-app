const { Router } = require("express");
const router = Router();
const connect = require("../moduls/connectBase");
const moment = require("moment");
const session = require("express-session");
const bodyParser = require("body-parser");

router.get("/", async (req, res) => {
    const login = req.session.user;
    const admin = req.session.admin;
    if (admin) {
        res.render("admin", {
            layout: "adminLayout",
            title: "Админ панель",
            login: login,
            admin: admin
        });
    } else {
        res.redirect("/");
    }
});

module.exports = router