require("dotenv").config()

const express = require('express')
const router = express.Router()

router.get('/', function(_, res) {
    res.render('index', { title: process.env.TITLE })
})

module.exports = router
