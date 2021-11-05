const express = require('express')
const router = express.Router()

router.get('/', (_, res) => {
    res.render('tags', { title: 'Express' })
})

router.post('/add', (req, res) => {

})

router.post('/remove/:id', (req, res) => {

})

router.post('/update/:id', (req, res) => {

})

module.exports = router
