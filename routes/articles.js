const express = require('express')
const fetch = require("node-fetch")
const router = express.Router()

function pagger(page, length) {
    page -= 1
    return (_, idx) => ((page * length) <= idx && idx < (page + 1) * length)
}

const MaxPerPage = 25

async function calculateLength(url) {
    const page = await fetch(url)
    const text = await page.text()
    const wpm = 225
    const words = text.trim().split(/\s+/).length
    const time = Math.ceil(words / wpm)
    return `${time} min`
}

router.get('/', (req, res) => {
    const currentPage = parseInt(req.query.page ?? "1")
    const db = req.app.get("db")

    res.render('articles', {
        title: 'Express',
        articles: db.select('articles', pagger(currentPage, MaxPerPage)),
        tags: db.select('tags', _ => true),
        currentPage: currentPage,
        totalPages: Math.ceil(db.count('articles', _ => true) / MaxPerPage),
    })
})

router.post('/add', async (req, res) => {
    const NeededParams = ["title", "tags", "url"]

    if (NeededParams.filter(p => p in req.body).length === NeededParams.length) {
        const db = req.app.get("db")

        db.insert("articles", {
            title: req.body.title,
            tags: req.body.tags,
            url: req.body.url,
            added_on: new Date(),
            read: req.body.read ?? false,
            notes: req.body.notes ?? "",
            length: await calculateLength(req.body.url),
        })

        res.json({
            status: "ok",
        })
    } else {
        res.json({
            status: "Error",
            message: `Missing parameter(s): ${NeededParams.filter(p => !(p in req.body))}`,
        })
    }
})

router.post('/remove/:id', (req, res) => {

})

router.post('/update/:id', (req, res) => {

})

module.exports = router
