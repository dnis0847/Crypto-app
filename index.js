const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars')
const session = require('express-session')
const homeRoutes = require('./routes/home')
const registerRoutes = require('./routes/register')
const loginRoutes = require('./routes/login')
const adminRoutes = require('./routes/admin')
const tableTokensRoutes = require('./routes/tableTokens')
const tableUsersRoutes = require('./routes/tableUsers')
const editUserRoutes = require('./routes/editUser')
const portfolioRoutes = require('./routes/portfolio')
const task = require('./moduls/updateDB');
const sendMessageonTelegram = require('./moduls/sendMessageonTelegram');

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}) 

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public')) 
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(session({
    secret: 'secret', 
    resave: false, 
    saveUninitialized: false, 
    cookie: {maxAge: 3600000} // 1 hour
}))

task.start();

app.use('/', homeRoutes)
app.use('/register', registerRoutes)
app.use('/login', loginRoutes)
app.use('/admin', adminRoutes)
app.use('/tableTokens', tableTokensRoutes)
app.use('/tableUsers', tableUsersRoutes)
app.use('/editUser', editUserRoutes)
app.use('/portfolio', portfolioRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})

