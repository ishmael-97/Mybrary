// This is for when we don't have resources or models in our URL!
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

// Export information to the server (Server must get information from indexRouter)
module.exports = router