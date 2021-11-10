const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const db = req.app.get("db")

    res.render('tags', {
        title: 'Express',
        tags: await db.select('tags', _ => true),
    })
})

router.get('/list', async (req, res) => {
    const db = req.app.get("db")

    res.json(await db.select('tags', _ => true))
})

router.post('/add', _ => {

})

router.post('/remove/:id', _ => {

})

router.patch('/update/:id', _ => {

})

module.exports = router
