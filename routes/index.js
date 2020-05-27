const express = require('express')
const router = express.Router()

//gọi file index trong thư mục views/index.ejs
router.get('/', (req, res) => {
    res.render('index')
})

module.exports = router