require("dotenv").config()

const express = require('express')
const router = express.Router()

function sumTimes(array) {
    return array.map(a => a.length.slice(0, a.length.length - " min".length))
        .map(t => parseInt(t))
        .reduce((a, b) => a + b)
}

router.get('/', async (req, res) => {
    const db = req.app.get("db")
    const articles = await db.select("articles", _ => true)
    const tags = await db.count("tags", _ => true)

    const to_read = articles.filter(a => !a.read).length
    const to_read_time = sumTimes(articles.filter(a => !a.to_read))
    const read_time = sumTimes(articles.filter(a => a.read))

    res.render('index', {
        title: process.env.TITLE,
        to_read: to_read,
        to_read_time: to_read_time,
        read: articles.length - to_read,
        read_time: read_time,
        tag_count: tags,
    })
})

router.get('/about', function (_, res) {
    res.render('about', {
        title: process.env.TITLE,
    })
})

module.exports = router
