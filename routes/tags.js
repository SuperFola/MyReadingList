const express = require('express')
const router = express.Router()

router.get('/', (_, res) => {
    res.render('tags', { title: 'Express' })
})

router.post('/add', _ => {

})

router.post('/remove/:id', _ => {

})

router.post('/update/:id', _ => {

})

module.exports = router
