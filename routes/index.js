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
            userID: req.session.user,
        })
    }
})

router.get('/home', auth.isAuthorized, async (req, res) => {
    const db = req.app.get("db")
    const articles = await db(`users/${req.session.user}`).select("articles", _ => true)
    const tags = await db(`users/${req.session.user}`).count("tags", _ => true)

    const to_read = articles.filter(a => !a.read).length
    const to_read_time = sumTimes(articles.filter(a => !a.to_read))
    const read_time = sumTimes(articles.filter(a => a.read))

    res.render('home', {
        title: process.env.TITLE,
        userID: req.session.user,
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
        const rows = await db.select("users", val => val.name === req.body.username)
        const hash = auth.hasher(req.body.password)

        if (rows.length === 1 && rows[0]["pass"] === hash) {
            req.session.user = req.body.username

            const timestamp = Date.parse(new Date())
            const token = auth.hasher(timestamp.toString() + hash)
            await db.update(
                "users",
                val => val.name === req.body.username,
                val => {
                    return {
                        ...val,
                        tokens: (val.tokens ?? []).filter(t => t.expireAt > timestamp).concat({
                            value: token,
                            expireAt: timestamp + process.env.MAX_TOKEN_LIFETIME_SEC,
                        }),
                    }
                }
            )

            return res.json({
                status: "ok",
                token: Buffer.from(`${req.body.username}:${token}`, "utf-8").toString("base64"),
            })
        }
    }

    return res.status(codes.errors.forbidden).json({
        status: "Error",
        message: "Wrong credentials",
    })
})

router.get('/disconnect', auth.isAuthorized, async (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

router.get('/about', async (req, res) => {
    res.render('about', {
        title: process.env.TITLE,
        userID: req.session.user,
    })
})

module.exports = router
