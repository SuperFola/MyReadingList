const express = require('express')
const fetch = require("node-fetch")
const codes = require("../httpcodes")
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

router.get('/list', (req, res) => {
    const currentPage = parseInt(req.query.page ?? "1")
    const quantity = parseInt(req.query.quantity ?? MaxPerPage)
    const db = req.app.get("db")

    res.json(db.select('articles', pagger(currentPage, quantity)))
})

router.post('/add', async (req, res) => {
    const NeededParams = ["title", "tags", "url"]

    if (NeededParams.filter(p => p in req.body).length === NeededParams.length) {
        const db = req.app.get("db")

        const ids = db.insert("articles", {
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
            updated: ids,
        })
    } else {
        res.status(codes.errors.precondition_failed).json({
            status: "Error",
            message: `Missing parameter(s): ${NeededParams.filter(p => !(p in req.body))}`,
        })
    }
})

router.get('/remove/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const db = req.app.get("db")

    if (isNaN(id)) {
        res.status(codes.errors.precondition_failed).json({
            status: "Error",
            message: `Couldn't parse article id ${req.params.id}`,
        })
    } else {
        try {
            db.delete("articles", val => val.id === id)
            res.json({
                status: "OK",
                deleted: id,
            })
        } catch (e) {
            res.status(codes.errors.not_found).json({
                status: "Error",
                message: `Couldn't find article with id ${id}`,
            })
        }
    }
})

router.post('/update/:id', (req, res) => {

})

module.exports = router
