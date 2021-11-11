require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const compression = require('compression')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.set('db', require('./db/db_adapter'))

app.use(logger('dev'))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
}))

app.use('/', require('./routes/index'))
app.use('/articles', require('./routes/articles'))
app.use('/tags', require('./routes/tags'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use((err, req, res, _) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render("error", {
        title: process.env.TITLE,
        userID: req.session.user,
        message: err.message,
        error: err,
    })
})

module.exports = app
