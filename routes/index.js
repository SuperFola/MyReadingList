const express = require('express')
const router = express.Router()

router.get('/', function(_, res) {
    res.render('index', { title: 'Express' })
})

module.exports = router
