// This is for when we don't have resources or models in our URL!
const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req, res) => {
    let books
    try {
        books = await Book.find().sort({ createdAt: 'desc'}).limit(10).exec()
    } catch {
        books = []
    }
    res.render('index', { books: books})
})

// Export information to the server (Server must get information from indexRouter)
module.exports = router