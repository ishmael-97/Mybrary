const express = require('express')
// Get router from Express
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Books Route
router.get('/',  async (req, res) => {
    // Search Query (complex)
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        // lte = less than or equal to!
        query = query.lte('publishedBefore', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        // gte = greater than or equal to!
        query = query.gte('publishedAfter', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Route: Creating Book (Recall from REST API: USE POST for Creation)
// USED send: We send information to alert about the new creation
router.post('/', upload.single('cover'), async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        // res.redirect('books/${newBook.id}')
        res.redirect('books')
    } catch {
        // response, existing book, and true (There exists an error)
        renderNewPage(res, book, true)
    }
    // author.save((err, newAuthor) => {
    //     if (err) {
    //         res.render('author/new', {
    //             author: author,
    //             errorMessage: 'Error creating Author'
    //         })
    //     } else {
    //         // res-redirect('author/${newAuthor.id}')
    //         res.redirect('authors')
    //     }
    // })
})

async function renderNewPage(res, book, hasError = false) {
     try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        const book = new Book()
        res.render('books/new', {
            authors: authors,
            book: book
        })
    } catch {
        res.redirect('/books')
    }
}

// Replaces removeCover (supported by filepond)
function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return 
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

// Export information to the server (Server must get information from indexRouter)
module.exports = router