const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('articles', {
        title: 'Express',
        articles: req.app.get('db').select('articles', _ => true),
        tags: req.app.get('db').select('tags', _ => true),
    })
})

router.post('/add', (req, res) => {

})

router.post('/remove/:id', (req, res) => {

})

router.post('/update/:id', (req, res) => {

})

module.exports = router
