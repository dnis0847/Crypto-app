const connect = require("../moduls/connectBase");

class User {
    constructor(login, email, phone, password) {
        this.login = login;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    static async checkUser(login, email, phone) {
        const db = await connect;
        const sql = "SELECT * FROM users WHERE login = ? OR email = ? OR phone = ?";
        const values = [login, email, phone];
        return new Promise((resolve, reject) => {
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

    async saveToDB() {
        const db = await connect;
        const sql = "INSERT INTO users (login, email, phone, password) VALUES (?, ?, ?, ?)";
        const values = [this.login, this.email, this.phone, this.password];
        db.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    }   
}

module.exports = User
