require("dotenv").config()

const express = require('express')
const fetch = require("node-fetch")
const codes = require("../httpcodes")
const router = express.Router()

function pagger(page, length, condition = _ => true) {
    page -= 1
    return (val, idx) => ((page * length) <= idx && idx < (page + 1) * length) && condition(val)
}

const MaxPerPage = 25

const FrozenArticlesAttributes = ["id", "length", "added_on"]

async function calculateLength(url) {
    const page = await fetch(url)
    const text = await page.text()
    const wpm = 225
    const words = text.trim().split(/\s+/).length
    const time = Math.ceil(words / wpm)
    return `${time} min`
}

router.get('/', async (req, res) => {
    const currentPage = parseInt(req.query.page ?? "1")
    const db = req.app.get("db")
    const total = await db.count('articles', _ => true)

    res.render('articles', {
        title: process.env.TITLE,
        title_suffix: "",
        articles: await db.select('articles', pagger(currentPage, MaxPerPage)),
        tags: await db.select('tags', _ => true),
        currentPage: currentPage,
        totalPages: Math.ceil(total / MaxPerPage),
    })
})

router.get('/tagged/:tag', async (req, res) => {
    const tag = req.params.tag
    const currentPage = parseInt(req.query.page ?? "1")
    const db = req.app.get("db")
    const total = await db.count('articles', (v) => v.tags.includes(tag))

    res.render('articles', {
        title: process.env.TITLE,
        title_suffix: `tagged '${tag}'`,
        articles: await db.select('articles', pagger(currentPage, MaxPerPage, (v) => v.tags.includes(tag))),
        tags: await db.select('tags', _ => true),
        currentPage: currentPage,
        totalPages: Math.ceil(total / MaxPerPage),
    })
})

router.get('/list', async (req, res) => {
    const currentPage = parseInt(req.query.page ?? "1")
    const quantity = parseInt(req.query.quantity ?? MaxPerPage)
    const db = req.app.get("db")

    res.json(await db.select('articles', pagger(currentPage, quantity)))
})

router.post('/add', async (req, res) => {
    const NeededParams = ["title", "tags", "url"]

    if (NeededParams.filter(p => p in req.body).length === NeededParams.length) {
        const db = req.app.get("db")

        const ids = await db.insert("articles", {
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

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const db = req.app.get("db")

    if (isNaN(id)) {
        res.status(codes.errors.precondition_failed).json({
            status: "Error",
            message: `Couldn't parse article id ${req.params.id}`,
        })
    } else {
        try {
            await db.delete("articles", val => val.id === id)
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

router.patch('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const db = req.app.get("db")

    if (isNaN(id)) {
        res.status(codes.errors.precondition_failed).json({
            status: "Error",
            message: `Couldn't parse article id ${req.params.id}`,
        })
    } else {
        try {
            await db.update(
                "articles",
                val => val.id === id,
                async val => {
                    const to_update = Object.fromEntries(
                        Array.from(Object.keys(req.body))
                            .filter(k => Object.prototype.hasOwnProperty.call(val, k) && !(k in FrozenArticlesAttributes))
                            .map(k => [k, req.body[k]]))
                    if (Object.prototype.hasOwnProperty.call(to_update, "url")) {
                        to_update.length = await calculateLength(to_update.url)
                    }

                    return { ...val, ...to_update }
                },
            )
            res.json({
                status: "OK",
                updated: id,
            })
        } catch (e) {
            res.status(codes.errors.not_found).json({
                status: "Error",
                message: `Couldn't find article with id ${id}`,
                more: e.message,
            })
        }
    }
})

module.exports = router
