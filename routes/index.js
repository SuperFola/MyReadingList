require("dotenv").config()

const express = require('express')
const auth = require('../db/auth')
const codes = require('../httpcodes')
const router = express.Router()

function sumTimes(array) {
    return array.map(a => a.length.slice(0, a.length.length - " min".length))
        .map(t => parseInt(t))
        .reduce((a, b) => a + b, 0)
}

router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect("/home")
    } else {
        res.render('index', {
            title: process.env.TITLE,
        })
    }
})

router.get('/home', auth.isAuthorized, async (req, res) => {
    const db = req.app.get("db")
    const articles = await db.select("articles", _ => true)
    const tags = await db.count("tags", _ => true)

    const to_read = articles.filter(a => !a.read).length
    const to_read_time = sumTimes(articles.filter(a => !a.to_read))
    const read_time = sumTimes(articles.filter(a => a.read))

    res.render('home', {
        title: process.env.TITLE,
        to_read: to_read,
        to_read_time: to_read_time,
        read: articles.length - to_read,
        read_time: read_time,
        tag_count: tags,
    })
})

router.post('/login', async (req, res) => {
    const db = req.app.get("db")("users")

    const NeededParams = ["username", "password"]
    if (NeededParams.filter(p => p in req.body).length === NeededParams.length) {
        const rows = db.select(req.body.user)
        if (rows.length === 1 && rows[0]["pass"] === auth.hasher(req.body.password)) {
            req.session.user = req.body.user
        }
        return res.json({
            status: "ok",
        })
    }

    return res.status(codes.errors.forbidden).json({
        status: "Error",
        message: "Wrong credentials",
    })
})

router.get('/about', function (_, res) {
    res.render('about', {
        title: process.env.TITLE,
    })
})

module.exports = router
