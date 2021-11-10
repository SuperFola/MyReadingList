require("dotenv").config()

const express = require('express')
const codes = require("../httpcodes")
const router = express.Router()

function isValidColor(color) {
    return color.length === 6 && /^[0-9A-F]{6}$/i.test(color)
}

router.get('/', async (req, res) => {
    const db = req.app.get("db")

    res.render('tags', {
        title: process.env.TITLE,
        tags: await db.select('tags', _ => true),
    })
})

router.get('/:id', async (req, res) => {
    const db = req.app.get("db")
    const data = await db.select('tags', v => v.name === req.params.id)
    res.json(data[0])
})

router.get('/list', async (req, res) => {
    const db = req.app.get("db")
    res.json(await db.select('tags', _ => true))
})

router.post('/add', async (req, res) => {
    const NeededParams = ["name", "color"]

    if (NeededParams.filter(p => p in req.body).length === NeededParams.length) {
        const db = req.app.get("db")

        if (isValidColor(req.body.color)) {
            const ids = await db.insert("tags", {
                name: req.body.name,
                color: req.body.color,
            })

            res.json({
                status: "ok",
                updated: ids,
            })
        } else {
            res.status(codes.errors.precondition_failed).json({
                status: "Error",
                message: `Invalid color format: ${req.body.color}`,
            })
        }
    } else {
        res.status(codes.errors.precondition_failed).json({
            status: "Error",
            message: `Missing parameter(s): ${NeededParams.filter(p => !(p in req.body))}`,
        })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    const db = req.app.get("db")

    try {
        await db.delete("tags", val => val.name === id)
        res.json({
            status: "OK",
            deleted: id,
        })
    } catch (e) {
        res.status(codes.errors.not_found).json({
            status: "Error",
            message: `Couldn't find tag with id ${id}`,
        })
    }
})

router.patch('/:id', async (req, res) => {
    const id = req.params.id
    const db = req.app.get("db")

    try {
        await db.update(
            "tags",
            val => val.id === id,
            async val => {
                const to_update = Object.fromEntries(
                    Array.from(Object.keys(req.body))
                        .filter(k => Object.prototype.hasOwnProperty.call(val, k))
                        .map(k => [k, req.body[k]]))

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
            message: `Couldn't find tag with id ${id}`,
        })
    }
})

module.exports = router
