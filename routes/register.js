const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const connect = require("../moduls/connectBase");
const User = require("../moduls/User");

router.get("/", (req, res) => {
    res.render("register", {
        layout: "registerLayout",
        title: "Регистрация",
    });
});

router.post("/", async (req, res) => {
    const { login, email, phone, password} = req.body;
    const user = new User(login, email, phone, password);
    let result = await User.checkUser(login, email, phone);
    if (result.length > 0) {
        res.send({
            message: "You have already registered with this login, email or phone",
        });
        return;
    } else {
        await user.saveToDB();
        res.send({
            message: "Registration completed",
        });
    }
});

module.exports = router;

