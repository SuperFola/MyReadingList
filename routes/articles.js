const express = require('express')
const router = express.Router()

function pagger(page, length) {
    page -= 1
    return (_, idx) => ((page * length) <= idx && idx < (page + 1) * length)
}

const MaxPerPage = 1

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

router.post('/add', (req, res) => {

})

router.post('/remove/:id', (req, res) => {

})

router.post('/update/:id', (req, res) => {

})

module.exports = router
